const inquirer = require("inquirer");
const fs = require("fs");
const util = require("util");
const axios = require("axios");

var convertapi = require('convertapi')('qT4fXsZhiJwJ2O6B')

const writeFileAsync = util.promisify(fs.writeFile);


// enter GitHub user name to retrieve GitHub info from the API call
inquirer
    .prompt([
        {
            type: "input",
            name: "username",
            message: "What is your GitHub name?"
          },
          {
            type: "input",
            name: "favColor",
            message: "Whatis your favorite color?"
          },
        ])
    .then(function ({
        username
    }) {

        getResDataGitHubAPI(username); //pass username to retreive the response data from the GitHub API

    })
    .catch(function (err) {
        console.log(err);
    })

;

async function getResDataGitHubAPI(username) {

    let res = await axios.get(`https://api.github.com/users/${username}`); //call GitHub API with the username entered by the prompt

    const templateFile = fs.readFileSync('./assets/GenerateHTML.html', {
        encoding: 'utf8'
    }) // create a template file for the generated profile

    // dynamically update index.html file with results from GitHub API

    let tempFile2 = templateFile.replace('${location}', res.data.location)
    tempFile2 = tempFile2.replace('${name}', res.data.name)
    tempFile2 = tempFile2.replace('${company}', res.data.company)
    tempFile2 = tempFile2.replace('{gitHubURL}', res.data.html_url)
    tempFile2 = tempFile2.replace('{queryURL}', `https://www.linkedin.com/in/evelynmcarone/`)
    tempFile2 = tempFile2.replace('{avatar}', res.data.avatar_url)
    tempFile2 = tempFile2.replace('${username}', res.data.login)
    tempFile2 = tempFile2.replace('${numRepos}', res.data.public_repos)
    tempFile2 = tempFile2.replace('${following}', res.data.following)
    tempFile2 = tempFile2.replace('${followers}', res.data.followers)

    tempFile2 = tempFile2.replace('${favColor}', `red`)
    // tempFile2 = tempFile2.replace('${favColor}', favColor)
    tempFile2 = tempFile2.replace('${favColor}', `red`)



    writeFileAsync("./artifacts/index.html", tempFile2)

    convertapi.convert('pdf', {
            File: './artifacts/index.html'
        })
        .then(function (result) {
            return result.file.save('./artifacts/profile.pdf');
        })

}