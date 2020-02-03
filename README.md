
# Responsible AI Trust Index

This project hosts a fork of the [Algorithmic Impact Assessment (AIA)](https://github.com/canada-ca/aia-eia-js) developed in Typescript.

It leverages the [SurveyJS library](https://surveyjs.io/Overview/Library/) to generate questions and answers. The primary source of the content, the file to edit if you want to change the questions and answers, is the `survey-enfr.json`, located in the `/src` folder.

Editing a JSON file directly may not be easy so you can use the web based [SurveyJS Builder](https://surveyjs.io/create-survey/) app to help you out.
However, please note that the way we are using the library is a little different than it was initially designed for so the native layout of the Builder may not be entirely intuitive.

For example, we have introduced weights in answers so that we can measure the score.
As such, answers have a very standard way of being created:

```json
"choices": [
                {
                    "value": "item1-3",
                    "text": {
                        "default": "Yes",
                        "fr": "Oui"
                    }
                },
                {
                    "value": "item2-0",
                    "text": {
                        "default": "No",
                        "fr": "Non"
                    }
                }
            ]
```

The above example shows how answers are listed; the value names are defined as `item<#>-<weight>` where the `<#>` is an incremental answer number and the `<weight>` is the weight given to that answer for the score.

That is because the overall tool we have built is an Impact Assessment tool, not a simple survey.
As such, some answers have weights that are used in a specific way in order to provide an impact assessment combining raw impact score and mitigation score.

The text of the answer, what will be displayed to the users, can then be defined in English and French by assigning the English value to `default` and the French value to `fr`.

To render the web application, we also make use of the Vue.js framework.
You can see all the components built in `/src/components` and all the views in `/src/views`.

Finally, if you would like to render the web application without the Government of Canada template and branding, you can remove the line 32 of the index.html file which sits in the /public folder.

Line to remove:
```html
<script type="text/javascript" src="helper/wet.js"></script>
```

Please note that we will not be removing the branding ourselves at this point but this may become more configurable as we break down the project in various components.

## License

[MIT License](LICENSE).
