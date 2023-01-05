// Imports the Google Cloud client library
const language = require('@google-cloud/language');


// Finds category based on predefined text. If no positive result is found, getCategory can be used to call APIs.
const categoryCheck = (text) => {
  text = text.toLowerCase();
  const arr = text.split(' ');
  if (arr.includes('buy')) return 'buy';
  if (arr.includes('watch')) return 'watch';
  if (arr.includes('eat')) return 'eat';
  if (arr.includes('read')) return 'read';

  return false;
}


// Returns a promise. Requires npm install --save @google-cloud/language.
async function quickstart(text) {

  // Creates a client
  const client = new language.LanguageServiceClient();

  // Classifies text in the document
  const document = {
    content: text,
    type: 'PLAIN_TEXT',
  };
  const classificationModelOptions = { v2Model: { contentCategoriesVersion: 'V2'} };
  const [classification] = await client.classifyText({ document, classificationModelOptions });

  // Updated to true if the text matches a certain category
  let eat, watch, read, buy = false;

  // Loops through categories and updates variables to true if category is found
  for (category of classification.categories) {

    if (category.name.includes('Restaurants') || category.name.includes('Food Service') || category.name.includes('Cuisines')) {
      eat = true;
    }

    if (category.name.includes('Movie') || category.name.includes('TV')) {
      watch = true;
    }

    if (category.name.includes('Book')) {
      read = true;
    }

    if (category.name.includes('Shopping') || category.name.includes('Games') || category.name.includes('Home & Garden') || category.name.includes('Computers & Electronics') || category.name.includes('/Food/')) {
      buy = true;
    }

    // Returns category matching the text
    if (eat) return 'eat';
    if (watch) return 'watch';
    if (read) return 'read';
    if (buy) return 'buy';

  }

}


module.exports = { quickstart, categoryCheck };
