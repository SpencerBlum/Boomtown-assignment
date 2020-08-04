
class Controller {

    //Mainly used to call fetches on adapter.js
    constructor(){
        this.adapter = new Adapter()
    }

    //function is used to run the page and is called on index.js
    initialize(){
        this.adapter.fetchApiLinks()
        .then(data => {
            this.buildMainList(data)
            this.checkDate(data)
            this.checkRepoLengths(data)
        })
    }
    

    //This function finds api links from top level 
    //Compares api links with the matching api string information from top level api but not equal to the top level api
    //Prepares string links to search for the response status in in add status list
    buildMainList = (data) => {
        let list = document.createElement("ul")
        const apiString = "https://api.github.com/orgs/BoomTownROI"
        for (const key of Object.keys(data)) {
            if (typeof data[key] === 'string' && data[key].includes(apiString) && data[key] != apiString){
                this.addStatusList(data[key])
            }
        }
    }

    //Function creates status buttons with displayed information of api links and return from fetch promise
    addStatusList = (url) => {
        let string = url + " | STATUS: "
        let list = document.getElementById("apiList")
        let button = document.createElement("button")
        let newEl = document.createElement("li")
        newEl.append(button)
        this.adapter.fetchFoundLinks(url)
        .then(resp => {
            if(resp.status === 200){
                string += "Good to go!"
                button.className = "button-success"
                button.addEventListener("click",()=>{
                    this.getMoreInfo(url)
                })
            } else {
                string += "Sorry was not found :("
                button.className = "button-failure"
                let foundSub = document.getElementById("sub") 
                button.addEventListener("click",()=>{
                    foundSub.innerText = ""
                    alert("Sorry please wait till the status is OK")})
            }
            button.innerText = string 
            list.append(newEl)
        })
    }

    //When status buttons are clicked that have a 200 status code this fuction is called to add id keys/values for array of objects
    getMoreInfo = (url) => {
        this.adapter.fetchFoundLinks(url)
        .then(resp => {
            if(resp.status === 200){
                resp.json()
                .then(data => {
                    let sub = document.getElementById("sub") 
                    sub.innerText = ""

                    let subTitle = document.createElement("h4") 
                    subTitle.innerText = "Found 'id's' and 'types' from " + url
                    sub.append(subTitle)

                    let list = document.createElement("ul") 
                    sub.append(list)

                    data.forEach((dataObject) => {
                        let newEl = document.createElement("li")
                        let dataId = dataObject.id
                        let dataType = (dataObject.type? dataObject.type : dataObject.name)
                        if(dataType){
                            newEl.innerText = `ID: ${dataId} | Type: ${dataType}`
                            list.append(newEl)
                        } else {
                            newEl.innerText = `ID: ${dataId}`
                            list.append(newEl)
                        }
                    })
                })
            } else {
                console.error(resp.url)
            }
        })
    }


    //This function checks to see if the updated date is later than the created at date
    checkDate(data) {
        let updatedStr = data.updated_at
        let createdStr = data.created_at

        let updatedObj = new Date(updatedStr)
        let createdObj = new Date(createdStr)

        let timeDiv = document.querySelector("#checkTimeDiv")
        timeDiv.innerHTML = ""
        let newh5 = document.createElement("h5")

        if ( updatedObj > createdObj) {    
            newh5.innerText = " VERIFIED:'updated_at' value is later than the 'created_at' date"
            timeDiv.appendChild(newh5)
    }else {  
        let timeDiv = document.querySelector("#checkTimeDiv")
        timeDiv.innerHTML = "" 
        newh5.innerText = "  NOT-VERIFIED:'updated_at' value is not later than the 'created_at' date" 
    }    
} 

//This function checks the Public Repos count against the git hub repos count
    async checkRepoLengths(data){
        let publicCount = data.public_repos
        let pageMax  = Math.ceil(data.public_repos/30);
        let i = 1
        let count = 0
            while(i <= pageMax){
                await this.adapter.fetchApiRepos(i)
                    .then(repoData => {
                    count += repoData.length
                })
                i += 1            
            }
            if(i > pageMax){
                let repoDiv = document.querySelector("#repoCountsDiv")
                let repoh5 = document.createElement("h5") 
                if(count === publicCount){
                    repoh5.innerText = `Both Public and Repo Counts are matching`
                    repoDiv.appendChild(repoh5)
                } else {
                    repoh5.innerText = `Public and Repo Counts are not matching`
                    repoDiv.appendChild(repoh5)
                }
            }
    }
}