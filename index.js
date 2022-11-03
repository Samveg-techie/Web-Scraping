import { Octokit } from "octokit";
import express from "express";
import ejs from "ejs";
import path from "path"
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import bodyParser from "body-parser";
import { title } from "process";

const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true })); 

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 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 

const octokit = new Octokit({
    auth: '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'
});

app.get('/',(req,res)=>{
    res.sendFile(path.join(__dirname, '/index.html'));
});

app.post('/', async (req,res) => {
    let issuesId = [];
    let issuesTitle = [];
    let ownerName = req.body.owner;
    let repoName = req.body.repo;
    try {
      for(let j=1;j<=1000;j++){
      const result = await octokit.request("GET /repos/{owner}/{repo}/issues", {
          owner: ownerName,
          repo: repoName,
          page:j,
          per_page: 100,
        });
        // id and title
        if(result.data.length == 0)break;
        for(let i=0;i<result.data.length;i++){
            issuesId.push(result.data[i].id);
            issuesTitle.push(result.data[i].title);
        }
    }
    } catch (error) {
      console.log(`Error! Status: ${error.status}. Message: ${error.response.data.message}`)
    } 
    res.render('index',{Ids:issuesId , Titles : issuesTitle, Ids : issuesId, repoName : repoName, ownerName : ownerName});
});

app.listen(3000,()=>{
   console.log('Connected to port 3000'); 
});