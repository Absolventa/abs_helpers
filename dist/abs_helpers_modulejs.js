(function() {
    'use strict';

    modulejs.define('abs_helpers', function() {

        var Helpers = (function() {

            var addListener,
                arrayIncludes,
                convertToCurrency,
                copyObjectPropertiesFromTo,
                createConfigObject,
                filenameOf,
                insertAfter,
                isMobileBrowser,
                isEmail,
                isNumber,
                loadScriptAsync,
                mergeObjects,
                parameterize,
                removeListener,
                type;


            addListener = function(obj, evt, fnc) {
                /**
                * Cross Browser helper to addEventListener.
                *
                * @param {HTMLElement} obj The Element to attach event to.
                * @param {string} evt The event that will trigger the binded function.
                * @param {function(event)} fnc The function to bind to the element.
                * @return {boolean} true if it was successfuly binded.
                */

                // W3C model
                if (obj.addEventListener) {
                    obj.addEventListener(evt, fnc, false);
                    return true;
                }
                // Microsoft model
                if (obj.attachEvent) {
                    obj.attachEvent("on" + evt, fnc);
                    return true;
                }

                return false;
            };

            removeListener = function(obj, type, fnc) {
               if (obj.removeEventListener) {
                  obj.removeEventListener(type, fnc, false);
               } else if (obj.detachEvent) {
                  obj.detachEvent("on" + type, fnc);
               }
            };



            /**
             * Checks if given string is in given Array
             *
             * @function arrayIncludes
             * @param {string} name
             * @param {array} inArray
             * @returns {boolean} true or false
             */

            arrayIncludes = function(name, inArray) {
                if(inArray.indexOf(name) >= 0) {
                    return true;
                } else {
                    return false;
                }
            };


            createConfigObject = function(configObject, defaultObject) {
                var mergedObject = {};


                if (configObject === null || typeof configObject !== 'object') {
                    configObject = {};
                }

                mergedObject = this.mergeObjects(configObject, defaultObject);

                return mergedObject;
            };


            /**
             * Returns the filename of an given file input field
             *
             * @function filenameOf
             * @param {node} input
             * @returns {string} filename
             */

            filenameOf = function (input) {
                var fullPath = input.value;
                if (fullPath) {
                    var startIndex = (fullPath.indexOf('\\') >= 0 ? fullPath.lastIndexOf('\\') : fullPath.lastIndexOf('/'));
                    var filename = fullPath.substring(startIndex);
                    if (filename.indexOf('\\') === 0 || filename.indexOf('/') === 0) {
                        return filename.substring(1);
                    }
                }
            };

            /**
             * Converts number to currency format, e.g. 1000.25 becomes "1.000,25€"
             *
             * @function convertToCurrency
             * @param {numeric} amount
             * @param {integer} [numberOfDecimals=2]
             * @param {boolean} [spacing=false] - Insert space between money amount and currency symbol
             * @param {string} [thousandsSeparatorSymbol=.]
             * @param {string} [decimalSeparatorSymbol=,]
             * @param {string=} [currencySymbol] - Defaultvalue defined in config.currencySymbol
             * @param {boolean} [appendCurrency=true]
             * @returns {string} Formatted string, e.g. '1.000,25€'
             */
            convertToCurrency = function(amount, currencySymbol, numberOfDecimals, spacing, thousandsSeparatorSymbol, decimalSeparatorSymbol, appendCurrency) {

                var spacingString,
                    formattedAmount,
                    thousandsRegExp;

                // return, if passed in amount is not a number
                if (!isNumber(amount)) {
                    return amount;
                }

                thousandsSeparatorSymbol = thousandsSeparatorSymbol !== undefined ? thousandsSeparatorSymbol : '.';
                decimalSeparatorSymbol = decimalSeparatorSymbol !== undefined ? decimalSeparatorSymbol : ',';
                currencySymbol = currencySymbol !== undefined ? currencySymbol : '€';
                appendCurrency = appendCurrency !== undefined ? appendCurrency : true;
                numberOfDecimals = isNaN(Math.abs(numberOfDecimals)) ? 2 : numberOfDecimals;

                if (numberOfDecimals === 0) {
                    thousandsRegExp = new RegExp('(\\d)(?=(\\d{3})+$)', 'gi');
                } else {
                    thousandsRegExp = new RegExp('(\\d)(?=(\\d{3})+\\' + decimalSeparatorSymbol + ')', 'gi');
                }

                formattedAmount = amount // = 1000.2500
                    .toFixed(numberOfDecimals) // results in: 1000.25
                    .replace(/\./gi, decimalSeparatorSymbol) // results in: 1000,25
                    .replace(thousandsRegExp, '$1' + thousandsSeparatorSymbol); // results in: 1.000,25

                spacing = spacing !== undefined ? spacing : false;
                spacingString = spacing ? ' ' : '';
                if (appendCurrency) {
                    formattedAmount = formattedAmount + spacingString + currencySymbol;
                } else {
                    formattedAmount = currencySymbol + spacingString + formattedAmount;
                }

                return formattedAmount;
            };

            insertAfter = function(referenceNode, newNode) {
                referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
            };

            /**
             * Checks if the user agent is from a known mobile device, i.e. one of
             * Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini
             *
             * @function isMobileBrowser
             * @param {integer=} browserWidth - Width you want to check (will default to window.innerWidth)
             * @return {boolean}
             */
            isMobileBrowser = function (browserWidth) {
                browserWidth = (browserWidth || window.innerWidth);

                if (/Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || browserWidth < 640) {
                    return true;
                }

                return false;
            };

            /**
             * Robust solution to identify different types of numbers
             *
             * @see http://stackoverflow.com/questions/18082/validate-numbers-in-javascript-isnumeric
             *
             * @function isNumber
             * @memberof! Absolventa.Helpers
             * @param {numeric} possiblyANumber
             * @return {boolean}
             */
            isNumber = function(possiblyANumber) {
                return !isNaN(parseFloat(possiblyANumber)) && isFinite(possiblyANumber);
            };

            /**
             * Checks if string contains an email address. Uses customized regexp for german
             * umlaut and ß characters.
             *
             * @function isEmail
             * @param {string} text
             * @return {boolean}
             * @example
             * isEmail("test1234@test1234_1234");     // => false
             * isEmail("max.power@gmail.com");        // => true
             * isEmail("mäöüÄÖÜß_päöü@mÄÖÜß.museum"); // => true
             *
             */
            isEmail = function(text) {
                var regex = /[a-zäöüÄÖÜß0-9!#$%&'*+\/=?\^_`{|}~\-]+(?:\.[a-zäöüÄÖÜß0-9!#$%&'*+\/=?\^_`{|}~\-]+)*@(?:[a-zäöüÄÖÜß0-9](?:[a-zäöüÄÖÜß0-9\-]*[a-zäöüÄÖÜß0-9])?\.)+(?:[A-Za-z]{2}|com|org|net|edu|gov|mil|biz|info|mobi|name|aero|asia|jobs|museum)\b/gim;

                if (text && regex.test(text)) {
                    return true;
                }

                return false;
            };

            /**
             * Creates a merge object out of given config and default objects.
             *
             * @function mergeObjects
             * @param {object} configObject
             * @param {object} defaultObject
             * @return {object}
             * @example
             * mergeObjects({test: 'my shiny config value'}, {test: 'my default value'});     // { test: 'my shiny config value'}
             *
             */

            mergeObjects = function(configObject, defaultObject) {
                var mergedObject = {};

                mergedObject = this.copyObjectPropertiesFromTo(mergedObject, defaultObject);
                mergedObject = this.copyObjectPropertiesFromTo(mergedObject, configObject);

                return mergedObject;
            };




            copyObjectPropertiesFromTo = function (targetObject, senderObject) {
                var prop;

                for (prop in senderObject) {
                    try {
                        // Property in destination object set; update its value.
                        if (senderObject[prop].constructor === Object) {
                            targetObject[prop] = this.mergeObjects(targetObject[prop], senderObject[prop]);
                        } else {
                            targetObject[prop] = senderObject[prop];
                        }
                    } catch (e) {
                        // Property in destination object not set; create it and set its value.
                        targetObject[prop] = senderObject[prop];
                    }
                }

                return targetObject;
            };




            /**
             * Identifies the type of the given subject param.
             *
             * @function type
             * @memberof! Absolventa.Helpers
             * @param {any} subject
             * @returns {string} Type of subject, e.g. 'string', 'regexp', 'undefined', 'element'
             */
            type = function(subject) {
                var typeResult,
                    toStringResult,
                    regex = /\[object (\w+)\]/g;

                if (subject !== subject) { // explicit check for NaN value
                    return 'NaN';
                }

                if (subject && subject.nodeType === 1) {
                    return 'element';
                }

                toStringResult = Object.prototype.toString.call(subject);

                typeResult = (regex.exec(toStringResult) || ['', ''])[1].toLowerCase();

                return typeResult;
            };

            /**
             * Returns a URL-friendly version of its input, substituting german
             * umlauts and ß.
             *
             * @function parameterize
             * @memberof! Absolventa.Helpers
             * @param {string} text
             * @returns {string} Parameterized string, e.g. 'hello-world-and-oesterreich'
             */
            parameterize = function(text) {
                if (text === undefined) { return ''; }
                var replaceMap = {
                    'ae' : /ä/,
                    'oe' : /ö/,
                    'ue' : /ü/,
                    'ss' : /ß/,
                    '-'  : /[^a-z0-9]+/gi, // global and case insensitive matching of non-char/non-numeric
                    ''   : /^-*|-*$/g      // get rid of any leading/trailing dashes
                };

                text = text.toLowerCase(); // first: make it small
                for(var srcString in replaceMap) {
                    text = text.replace(replaceMap[srcString], srcString);
                }
                return text;
            };

            /**
             * Asynchronously loads a script from a url.
             *
             * @function loadScriptAsync
             * @memberof! Absolventa.Helpers
             * @param {string} url
             * @param {requestCallback} callback - Function to execute when script has loaded
             */
            loadScriptAsync = function(url, callback) {
                var script = document.createElement("script");

                if (script.readyState) { //IE
                    script.onreadystatechange = function () {
                        if (script.readyState === "loaded" || script.readyState === "complete") {
                            script.onreadystatechange = null;
                            callback();
                        }
                    };
                } else { //Others
                    script.onload = function () {
                        callback();
                    };
                }

                script.src = url;
                document.getElementsByTagName("head")[0].appendChild(script);
            };

            return {
                addListener : addListener,
                arrayIncludes : arrayIncludes,
                convertToCurrency : convertToCurrency,
                copyObjectPropertiesFromTo : copyObjectPropertiesFromTo,
                createConfigObject: createConfigObject,
                filenameOf : filenameOf,
                insertAfter : insertAfter,
                isEmail : isEmail,
                isMobileBrowser : isMobileBrowser,
                isNumber : isNumber,
                loadScriptAsync : loadScriptAsync,
                mergeObjects : mergeObjects,
                parameterize : parameterize,
                removeListener : removeListener,
                type : type
            };

        }());


        return Helpers;

    });



}());
