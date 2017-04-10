function translate() {

    i18next
        .use(i18nextXHRBackend)
        .use(i18nextBrowserLanguageDetector)
        .init({
            debug: true,
            resGetPath: 'locales/{{lng}}/{{ns}}.json',
            fallbackLng: "us",
            backend: {
                loadPath: 'locales/{{lng}}/{{ns}}.json',
                // your backend server supports multiloading
                // /locales/resources.json?lng=de+en&ns=ns1+ns2
                allowMultiLoading: false
            }
        }, function (err, t) {

            jqueryI18next.init(i18next, $, {
                tName: 't', // --> appends $.t = i18next.t
                i18nName: 'i18n', // --> appends $.i18n = i18next
                handleName: 'localize', // --> appends $(selector).localize(opts);
                selectorAttr: 'data-i18n', // selector for translating elements
                targetAttr: 'i18n-target', // data-() attribute to grab target element to translate (if diffrent then itself)
                optionsAttr: 'i18n-options', // data-() attribute that contains options, will load/set if useOptionsAttr = true
                useOptionsAttr: false, // see optionsAttr
                parseDefaultValueFromContent: true // parses default values from content ele.val or ele.text
            });

            var language = $('#language');
            language.attr("data-selected-country", i18next.language);
            language.flagStrap({
                countries: {
                    "us": "En",
                    "cn": "Ch",
                    "ru": "Ru"
                },
                buttonType: "btn-default flag-button",
                onSelect: function (value, element) {
                    var lang = $(element).children("option[selected=selected]").val();
                    window.i18next.changeLanguage(lang);
                    location.reload();
                },
                placeholder: {
                    value: "",
                    text: "Language"
                }
            });

            $("html").localize();
            $("body").show();

        });
}