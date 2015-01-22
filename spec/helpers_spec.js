/*global runs, waits, describe*/

describe("Helpers module", function() {

    "use strict";

    it("module is defined", function() {
        expect(modulejs.require('abs_helpers')).toBeDefined();
    });

    describe("public interface", function() {

        var helpers;

        beforeEach(function() {
            helpers = modulejs.require('abs_helpers');
        });

        describe("convertToCurrency method", function() {

            it("should be defined", function() {
                expect(helpers.convertToCurrency).toBeDefined();
            });

            it("should be a function", function() {
                expect(typeof helpers.convertToCurrency).toEqual('function');
            });

            it("returns a formatted string", function() {
                expect(helpers.convertToCurrency(1000000)).toEqual('1.000.000,00€');
                expect(helpers.convertToCurrency(1000000.25)).toEqual('1.000.000,25€');
            });

            it("uses custom currency symbol", function() {
                expect(helpers.convertToCurrency(1000000, '$')).toEqual('1.000.000,00$');
                expect(helpers.convertToCurrency(1000000.75, '$')).toEqual('1.000.000,75$');
            });

            it("sets amount of decimal places", function() {
                expect(helpers.convertToCurrency(1000000, '€', 0)).toEqual('1.000.000€');
                expect(helpers.convertToCurrency(1000000.75, '€', 0)).toEqual('1.000.001€');
            });

            it("sets fallback value for invalid decimalPlaces param", function() {
                expect(helpers.convertToCurrency(1000000, '€', undefined)).toEqual('1.000.000,00€');
                expect(helpers.convertToCurrency(1000000.75, '€', undefined)).toEqual('1.000.000,75€');
                expect(helpers.convertToCurrency(1000000, '€', 'why am I a string')).toEqual('1.000.000,00€');
                expect(helpers.convertToCurrency(1000000.75, '€', 'why am I a string')).toEqual('1.000.000,75€');
            });

            it("sets spacing between amount and currency symbol", function() {
                expect(helpers.convertToCurrency(1000000, '€', 0, false)).toEqual('1.000.000€');
                expect(helpers.convertToCurrency(1000000, '€', 0, true)).toEqual('1.000.000 €');
                expect(helpers.convertToCurrency(1000000.75, '€', 2, false)).toEqual('1.000.000,75€');
                expect(helpers.convertToCurrency(1000000.75, '€', 2, true)).toEqual('1.000.000,75 €');
            });

            it("uses custom separators", function() {
                expect(helpers.convertToCurrency(1000000, '€', 2, false, ',', '.')).toEqual('1,000,000.00€');
                expect(helpers.convertToCurrency(1000000.75, '€', 2, false, ',', '.')).toEqual('1,000,000.75€');
            });

            it("sets custom position of currency symbol", function() {
                expect(helpers.convertToCurrency(1000000, '$', 2, false, ',', '.', false)).toEqual('$1,000,000.00');
                expect(helpers.convertToCurrency(1000000.75, '$', 2, false, '.', ',', false)).toEqual('$1.000.000,75');
            });

        });

        describe("isMobileBrowser function", function() {

            it("is defined", function() {
                expect(helpers.isMobileBrowser).toBeDefined();
            });

            it("should return true if document width is smaller than 640px", function() {
                expect(helpers.isMobileBrowser(600)).toBeTruthy();
            });

             it("should return false if document width is bigger or equal 640px", function() {
                expect(helpers.isMobileBrowser(640)).toBeFalsy();
            });

        });

        describe("isNumber function", function() {
            describe("recognises", function() {

                describe("integers, e.g.", function() {
                    it("negative integer string", function() {
                        expect(helpers.isNumber("-10")).toBeTruthy();
                    });
                    it("zero string", function() {
                        expect(helpers.isNumber("0")).toBeTruthy();
                    });
                    it("positive integer string", function() {
                        expect(helpers.isNumber("5")).toBeTruthy();
                    });
                    it("negative integer number", function() {
                        expect(helpers.isNumber(-16)).toBeTruthy();
                    });
                    it("zero integer number", function() {
                        expect(helpers.isNumber(0)).toBeTruthy();
                    });
                    it("positive integer number", function() {
                        expect(helpers.isNumber(16)).toBeTruthy();
                    });
                    it("hexadecimal integer literal string", function() {
                        expect(helpers.isNumber("0xFF")).toBeTruthy();
                    });
                    it("hexadecimal integer literal", function() {
                        expect(helpers.isNumber(0xFFF)).toBeTruthy();
                    });
                });

                describe("floats", function() {
                    it("Negative floating point string", function() {
                        expect(helpers.isNumber("-1.6")).toBeTruthy();
                    });
                    it("Positive floating point string", function() {
                        expect(helpers.isNumber("4.536")).toBeTruthy();
                    });
                    it("Negative floating point number", function() {
                        expect(helpers.isNumber(-2.6)).toBeTruthy();
                    });
                    it("Positive floating point number", function() {
                        expect(helpers.isNumber(3.1415)).toBeTruthy();
                    });
                    it("Exponential notation", function() {
                        expect(helpers.isNumber(8e5)).toBeTruthy();
                    });
                    it("Exponential notation string", function() {
                        expect(helpers.isNumber("123e-2")).toBeTruthy();
                    });
                });

                describe("non-numeric values", function() {
                    it("Empty string", function() {
                        expect(helpers.isNumber("")).toBeFalsy();
                    });
                    it("Whitespace characters string", function() {
                        expect(helpers.isNumber(" ")).toBeFalsy();
                    });
                    it("Tab characters string", function() {
                        expect(helpers.isNumber("\t\t")).toBeFalsy();
                    });
                    it("Alphanumeric character string", function() {
                        expect(helpers.isNumber("abcdefghijklm1234567890")).toBeFalsy();
                    });
                    it("Non-numeric character string", function() {
                        expect(helpers.isNumber("xabcdefx")).toBeFalsy();
                    });
                    it("Boolean true literal", function() {
                        expect(helpers.isNumber(true)).toBeFalsy();
                    });
                    it("Boolean false literal", function() {
                        expect(helpers.isNumber(false)).toBeFalsy();
                    });
                    it("Number with preceding non-numeric characters", function() {
                        expect(helpers.isNumber("bcfed5.2")).toBeFalsy();
                    });
                    it("Number with trailling non-numeric characters", function() {
                        expect(helpers.isNumber("7.2acdgs")).toBeFalsy();
                    });
                    it("Undefined value", function() {
                        expect(helpers.isNumber(undefined)).toBeFalsy();
                    });
                    it("Null value", function() {
                        expect(helpers.isNumber(null)).toBeFalsy();
                    });
                    it("NaN value", function() {
                        expect(helpers.isNumber(NaN)).toBeFalsy();
                    });
                    it("Infinity primitive", function() {
                        expect(helpers.isNumber(Infinity)).toBeFalsy();
                    });
                    it("Positive Infinity", function() {
                        expect(helpers.isNumber(Number.POSITIVE_INFINITY)).toBeFalsy();
                    });
                    it("Negative Infinity", function() {
                        expect(helpers.isNumber(Number.NEGATIVE_INFINITY)).toBeFalsy();
                    });
                    it("Date object", function() {
                        expect(helpers.isNumber(new Date(2009,1,1))).toBeFalsy();
                    });
                    it("Empty object", function() {
                        expect(helpers.isNumber(new Object())).toBeFalsy();
                    });
                    it("Instance of a function", function() {
                        expect(helpers.isNumber(function(){})).toBeFalsy();
                    });
                });

            });

        });

        describe("loadScriptAsync method", function() {

            var cleanup = function() {
                delete window.testScriptLoaded;
            };

            it("is defined", function() {
                expect(helpers.loadScriptAsync).toBeDefined();
            });

            it("is a function", function() {
                expect(typeof helpers.loadScriptAsync).toEqual('function');
            });
            it("appends one script to the head tag", function() {
                var oldScriptTagAmount = document.getElementsByTagName('script').length,
                    newScriptTagAmount;

                cleanup();
                expect(typeof testScriptLoaded).toEqual('undefined');

                runs(function() {
                    helpers.loadScriptAsync('base/fixtures/sample_script.js', function(){});
                });

                waits(100);

                runs(function() {
                    expect(testScriptLoaded).toBeDefined();
                    expect(testScriptLoaded).toEqual(true);
                    newScriptTagAmount = document.getElementsByTagName('script').length;
                    expect(newScriptTagAmount).toEqual(oldScriptTagAmount + 1);
                    cleanup();
                });

            });
        });

        describe("isEmail method", function() {
            it("is defined", function() {
                expect(helpers.isEmail).toBeDefined();
            });

            it("is a function", function() {
                expect(typeof helpers.isEmail).toEqual('function');
            });

            it("returns false for non email strings", function() {
                expect(helpers.isEmail('test')).toEqual(false);
                expect(helpers.isEmail('')).toEqual(false);
                expect(helpers.isEmail('test.test@test')).toEqual(false);
            });

            it("returns true for valid email strings", function() {
                expect(helpers.isEmail('max.power@gmail.com')).toEqual(true);
                expect(helpers.isEmail('max.power_yeah@office-spacetest.co.uk')).toEqual(true);
            });

            it("recognizes umlaut email strings", function() {
                expect(helpers.isEmail('äöüÄÖÜß.giecheäöüÄÖÜß@gmäöüÄÖÜßil.com')).toEqual(true);
            });
        });

        describe("type method", function() {
            it("is defined", function() {
                expect(helpers.type).toBeDefined();
            });

            it("is a function", function() {
                expect(typeof helpers.type).toEqual('function');
            });

            describe("recognises", function() {
                it("strings", function() {
                    expect(helpers.type('')).toEqual('string');
                    expect(helpers.type('1')).toEqual('string');
                    expect(helpers.type('test')).toEqual('string');
                });

                it("numbers", function() {
                    expect(helpers.type(1)).toEqual('number');
                    expect(helpers.type(1.4)).toEqual('number');
                });

                it("arrays", function() {
                    expect(helpers.type([])).toEqual('array');
                    expect(helpers.type(['test'])).toEqual('array');
                    expect(helpers.type(['test', 1])).toEqual('array');
                });

                it("objects", function() {
                    expect(helpers.type({})).toEqual('object');
                });

                it('boolean', function() {
                    expect(helpers.type(true)).toEqual('boolean');
                    expect(helpers.type(false)).toEqual('boolean');
                });

                it("functions", function() {
                    expect(helpers.type(function(){})).toEqual('function');
                });

                it("regex'", function() {
                    expect(helpers.type(/.*/)).toEqual('regexp');
                });

                it('undefined', function() {
                    expect(helpers.type()).toEqual('undefined');
                    expect(helpers.type(undefined)).toEqual('undefined');
                });

                it('null', function() {
                    expect(helpers.type(null)).toEqual('null');
                });

                it("NaN", function() {
                    expect(helpers.type(NaN)).toEqual('NaN');
                });

                it("dom nodes", function() {
                    expect(helpers.type(document.body)).toEqual('element');
                });
            });
        });

        describe("parameterize method", function() {

            it("is defined", function() {
                expect(helpers.parameterize).toBeDefined();
            });

            it("is a function", function() {
                expect(typeof helpers.parameterize).toEqual('function');
            });

            it("returns a string with input missing", function() {
                expect(helpers.parameterize()).toEqual('');
            });

            it("returns lowercase characters", function() {
                var input = 'HELLOWORLD'
                expect(helpers.parameterize(input)).toEqual('helloworld');
            });

            it("replaces whitespaces with dashes", function() {
                var input = 'hello world'
                expect(helpers.parameterize(input)).toEqual('hello-world');
            });

            it("removes leading and trailing whitespaces", function() {
                var input = '   helloworld '
                expect(helpers.parameterize(input)).toEqual('helloworld');
            });

            it("replaces german umlauts", function() {
                var input = 'hällüwÖrld'
                expect(helpers.parameterize(input)).toEqual('haelluewoerld');
            });

            it("replaces ß with ss", function() {
                var input = 'helloß'
                expect(helpers.parameterize(input)).toEqual('helloss');
            });

            it("leaves one dash in place", function() {
                var input = 'hello--world'
                expect(helpers.parameterize(input)).toEqual('hello-world');
            });
        });

        describe('arrayIncludes method', function() {
            it("returns true when value is in array", function() {
                var array = ['foo', 'bar'];
                expect(helpers.arrayIncludes('bar', array)).toBe(true);
            });

            it("returns false when value is not in array", function() {
                 var array = ['foo', 'bar'];
                expect(helpers.arrayIncludes('baz', array)).toBe(false);
            });
        });

        describe('mergeObjects method', function() {
            it("is present", function() {
                expect(helpers.mergeObjects).toBeDefined();
            });
        });

        describe('copyObjectPropertiesFromTo method', function() {
            it("is present", function() {
                expect(helpers.copyObjectPropertiesFromTo).toBeDefined();
            });
        });

        describe('createConfigObject method', function() {
            it("is present", function() {
                expect(helpers.createConfigObject).toBeDefined();
            });
        });

        describe('addListener method', function() {
            it("is present", function() {
                expect(helpers.addListener).toBeDefined();
            });
        });

        describe('removeListener method', function() {
            it("is present", function() {
                expect(helpers.removeListener).toBeDefined();
            });
        });

        describe('insertAfter method', function() {
            it("is present", function() {
                expect(helpers.insertAfter).toBeDefined();
            });
        });

    });

});
