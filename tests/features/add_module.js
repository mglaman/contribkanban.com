module.exports = {
  'add Paragraphs project' : function (browser) {
    browser
      .url('http://127.0.0.1:8080')
      .waitForElementVisible('body', 1000);
    browser.setValue('input[placeholder="Project machine name"]', 'paragraphs')
      .click('#AddBoard button')
      .pause(1000);
    browser.expect.element('.page-title h1').text.to.contain('Paragraphs')
  },
  'add Invalid project' : function (browser) {
    browser
      .url('http://127.0.0.1:8080')
      .waitForElementVisible('body', 1000);
    browser
      .setValue('input[placeholder="Project machine name"]', 'some_fake_project')
      .click('#AddBoard button')
      .pause(1000);
    browser.expect.element('.page-title h1').text.to.contain('Boards');
    browser.expect.element('#AddBoard').text.to.contain('This project is invalid');
  },
};
