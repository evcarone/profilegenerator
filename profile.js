const inquirer = require("inquirer");
const fs = require("fs");
const util = require("util");
var convertapi = require('convertapi')('qT4fXsZhiJwJ2O6B')

const writeFileAsync = util.promisify(fs.writeFile);


function promptUser() {
    return inquirer.prompt([{
            type: "input",
            name: "username",
            message: "What is your GitHub user name?"
        },
        {
            type: "input",
            name: "location",
            message: "Where are you from?"
        },
        
        {
            type: "input",
            name: "linkedin",
            message: "Enter your LinkedIn URL."
        }
    ]);
}

function generateHTML(answers) {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css">
  <title>Document</title>
</head>
<body>
  <div class="jumbotron jumbotron-fluid">
  <div class="container">
    <h1 class="display-4">Hi! My name is ${answers.username}</h1>
    <p class="lead">I am from ${answers.location}.</p>
    <h3>Example heading <span class="badge badge-secondary">Contact Me</span></h3>
    <ul class="list-group">
      <li class="list-group-item">My GitHub username is ${answers.username}</li>
      <li class="list-group-item">My GitHub total Repos are ${answers.numRepos}</li>
      <li class="list-group-item">LinkedIn: {queryURL}</li>
      <li class="list-group-item">link to my picture:</li>
    </ul>
  </div>
</div>
</body>
</html>`;
}


// link for evelyns github avatar & github api call for all my repos
// url: 'https://avatars1.githubusercontent.com/u/50718409?v=4',
// https://api.github.com/users/evcarone/repos?per_page=100'
    
var queryURL
promptUser()
    .then(function (answers) {

        const html = generateHTML(answers);

        writeFileAsync("index.html", html)

    })
    .then(function(userInfo){
        const templateFile = fs.readFileSync('./index.html', {encoding: 'utf8'})
         let tempFile = templateFile.replace('{queryURL}', 'HELLO')
    })
    .then(function () {
        convertapi.convert('pdf', {
                File: './index.html'
            })
            .then(function (result) {
                return result.file.save('./myfile.pdf');
            })

    })
    .catch(function (err) {
        console.log(err);
    });