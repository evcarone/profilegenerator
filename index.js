const inquirer = require("inquirer");
const fs = require("fs");
const util = require("util");
const axios = require("axios");

var convertapi = require('convertapi')('qT4fXsZhiJwJ2O6B')

const writeFileAsync = util.promisify(fs.writeFile);


// enter GitHub user name to retrieve GitHub info from the API call
inquirer
    .prompt({
        message: "Enter your GitHub username:",
        name: "username"
    })
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

    //replace 

    let tempFile2 = templateFile.replace('${answers.location}', res.data.location)
    tempFile2 = tempFile2.replace('${name}', res.data.name)
    tempFile2 = tempFile2.replace('${company}', res.data.company)
    tempFile2 = tempFile2.replace('{gitHubURL}', res.data.html_url)
    tempFile2 = tempFile2.replace('{queryURL}', `https://www.linkedin.com/in/evelynmcarone/`)
    tempFile2 = tempFile2.replace('{avatar}', res.data.avatar_url)
    tempFile2 = tempFile2.replace('${answers.username}', res.data.login)
    tempFile2 = tempFile2.replace('${answers.numRepos}', res.data.public_repos)


    writeFileAsync("./artifacts/index.html", tempFile2)

    convertapi.convert('pdf', {
            File: './artifacts/index.html'
        })
        .then(function (result) {
            return result.file.save('./artifacts/profile.pdf');
        })

}