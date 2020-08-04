class Adapter {

    //Get request for top level boomtown api
    fetchApiLinks(){
        return fetch("https://api.github.com/orgs/boomtownroi")
        .then(resp => resp.json())
    }

    // fetch for repos with page number
    fetchApiRepos(pageNum){
        return fetch(`https://api.github.com/orgs/boomtownroi/repos?page=${pageNum}`)
        .then(resp => resp.json())
    }


    fetchFoundLinks(apiLink){
        return fetch(apiLink)
    }
} 