const allowText = 140
let allTwitts = {}

//Add event listener
document.getElementById('dn-textarea').addEventListener("DOMCharacterDataModified", countText)
document.getElementById('dn-twitt-btn').addEventListener('click', twitt)

//Main class as a template for any twitt object
class Twitter {
    constructor(content, type, parent, name) {
        this.canTwitt = true;
        this.parent = parent
        this.type = type
        this.like = 0
        this.id = Date.now()
        this.retwitts = []
        this.comments = []
        this.htmls = []
        this.name = name
        this.content = this.searchHashTag(this.id, content)
        this.isClicked = false
        this.isRefer = ''
        this.hashTag = `@${this.name}`
        this.hashTags = []

        //Set links for related nodes
        this.setLinks()
    }
    //Update attributes of parent and child twitts when a new twitt is created
    setLinks() {
        allTwitts[this.id] = this
        if (this.type === 'comment') {
            //Add new comment to the end of array of parent twitt
            this.parent.comments.push(this)

            //Update the UI
            document.getElementById(`cmt-${this.parent.id}`).innerText = this.parent.comments.length
        } else if (this.type === 'retwitt') {
            //Add new retwitt to the end of array of parent twitt
            this.parent.retwitts.push(this)

            //Update the UI
            document.getElementById(`ret-${this.parent.id}`).innerText = this.parent.retwitts.length
        } else {
            if (this.parent === null) {
                return
            }
            //Add new twitt to the beginning og array of parent twitt
            this.parent.retwitts.unshift(this)
        }
    }
    //display general HTML
    displayHTML(anotherContent) {
        let classTwitt = ''
        switch (this.type) {
            case 'comment':
                classTwitt = 'dn-comment-card'
                break
            case 'twitt':
                classTwitt = 'dn-twitt-card'
                break
            case 'retwitt':
                classTwitt = 'dn-retwitt-card'
        }

        let img = `<img class='col-md-3 dn-img' src='...' alt='...' id='img-${this.id}'>`
        let name = `<span id='name-${this.id}' class='dn-content-name'>${this.name}</span>`
        let hashTag = `<a id='name-${this.id}' href='#' onclick='searchHashTag(${this.hashTag})' class='dn-content-hashtag'>${this.hashTag}</a>`
        let conT = `<p id='content-${this.id}'>${this.content}</p>`
        if (anotherContent !== null) {
            conT = `<p id='p-${this.id}'>${this.content}</p><div id='content-${this.id}'>${anotherContent}</div>`
        }


        let btnLike = `<button class ="far fa-heart" id='like-${this.id}' onclick='likeTwitt(${this.id})'> <span id='lk-${this.id}'>0</span></button>`
        let btnComment = `<button class="far fa-comments" id='comment-${this.id}' onclick='commentTwitt(${this.id})'><span id='cmt-${this.id}'>0</span></button>`
        let btnDelete = `<button class="far fa-trash-alt" id='delete-${this.id}' onclick='deleteTwitt(${this.id})'><span id='dlt-${this.id}'>0</span></button>`
        let reTwitt = `<button class="far fa-copy " id='retwitt-${this.id}' onclick='reTwitt(${this.id})'><span id='ret-${this.id}'>0</span></button>`

        let box = `
    <div class='card ${classTwitt}' id='card-${this.id}'>
      <div class='row no-gutters twitt-box' id='box-${this.id}'>
        ${img}
        <div class='col-md-9 dn-twitt-content'>
          ${name} ${hashTag}
          <p>${this.isRefer}</p>
          ${conT}
          <div class='dn-twitt-btn'>${btnLike}${btnComment}${btnDelete}${reTwitt}</div>
        </div>
      </div>
    </div>
    `
        return box
    }
    //Display the cloned twitt of parent twitt inside of a retwitt
    displayRetwittHTML() {
        let img = `<img class='col-md-3 dn-img' src='...' alt='...' id='img-${this.id}'>`
        let name = `<span id='name-${this.id}' class='dn-content-name'>${this.name}</span>`
        let hashTag = `<a id='name-${this.id}' href='#' onclick='searchHashTag(${this.hashTag})' class='dn-content-hashtag'>${this.hashTag}</a>`
        let conT = `<p id='content-${this.id}' class='content-${this.id}'>${this.content}</p>`

        //This card and box have different id for any reason
        let box = `
    <div class='card dn-retwitt-card-inside' id='card+${this.id}'>
      <div class='row no-gutters twitt-box' id='box+${this.id}'>
        ${img}
        <div class='col-md-9 dn-twitt-content'>
          ${name} ${hashTag}
          <p>${this.isRefer}</p>
          ${conT}
        </div>
      </div>
    </div>
    `
        return box
    }
    //Function to set reference if a twitt is retwitted
    setRefer(hashTag) {
        this.isRefer = `Being refered to ${hashTag}`
    }
    //Function to search hashtag and update Hashtag 
    searchHashTag(id, content) {
        let words = content.split(' ')
        let output = words.reduce((total, item) => {
            if (item.charAt(0) === '#') {
                //Update the number of hashtags in a content
                this.hashTags.push(item)
                return total += `<a id='link-${id}' href='#'>${item} </a>`
            }
            return total += item + ' '
        }, '')
        return output
    }
}
let mainTwitt = new Twitter('', 'twitt', null, 'DungNgo')
mainTwitt.id = 0

//Function to count the number of text left
function countText() {
    console.log('sdcnsk')
    let textarea = document.getElementById('dn-textarea')
    let numCount = textarea.innerText.split('').length
    let countText = document.getElementById('dn-count-text')

    if (allowText < numCount) {
        countText.style.color = 'red'
    }
    else {
        countText.style.color = 'black'
    }
    document.getElementById('dn-count-text').innerHTML = allowText - numCount
}

//Function to create a new Twitt if user clicks Twitt - CREAT NEW TWITT
function twitt() {
    //Get the twitt area
    let area = document.getElementById(`card-${mainTwitt.id}`)

    //Check if user can twitt. If not, alert the user, reset Tweet board, and return immediately
    let wordNum = document.getElementById('dn-textarea').innerText.split('').length
    if (wordNum > allowText) {
        alert("Can't tweet. Maximum number of characters in a tweet is 140.")
        resetTwitt()
        return
    }

    //Get the content user wants to twitt
    let content = document.getElementById('dn-textarea').innerText

    //Create a new twitt object
    let newTwitt = new Twitter(content, 'twitt', mainTwitt, 'DungNgo')

    //Update the UI and reset UI
    area.innerHTML = newTwitt.displayHTML(null) + area.innerHTML
    resetTwitt()
}

//Function to reset the tweet board
function resetTwitt() {
    document.getElementById('dn-count-text').innerHTML = 140
    document.getElementById('dn-textarea').innerHTML = ''
}

//Function renders when user clicks like a twitt
function likeTwitt(id) {
    let btnLike = document.getElementById(`lk-${id}`)
    let twitt = allTwitts[id]
    if (!twitt.isClicked) {
        twitt.like++
        twitt.isClicked = true
    } else {
        twitt.like--
        twitt.isClicked = false
    }
    btnLike.innerText = twitt.like
}

//Function renders when user clicks comment button of twitt with 'id' - CREATE NEW TWITT
function commentTwitt(id) {
    //Ask the user for input
    let cmt = prompt('What do you think about this twitt: ')

    //Get the twitt that user want to comment on
    let card = document.getElementById(`card-${id}`)
    let thisTwitt = allTwitts[id]

    //Create a new twitt with 'comment' type
    let newComment = new Twitter(cmt, 'comment', thisTwitt, 'Luke')

    //Indicate what this twitt being refered to a twitt that is commented
    newComment.setRefer(thisTwitt.hashTag)

    //Add new comment to commented twitt
    card.innerHTML = card.innerHTML + newComment.displayHTML(null)
}

//Function renders when user clicks delete a twitt
function deleteTwitt(id) {
    //Get the twitt with 'id'
    let thisTwitt = allTwitts[id]
    let innerHTML = ''

    //Get the parent twitt
    let parentTwitt = thisTwitt.parent

    //Get card div of parent twitt. Recall: card is the wrapper of box
    let parentCard = document.getElementById(`card-${parentTwitt.id}`)
    let parentBox = document.getElementById(`box-${parentTwitt.id}`)

    //delete twitt with 'id'
    delete allTwitts[id]

    if (thisTwitt.type === 'twitt') {
        //Get an array of all twitts in parent twitt
        let twitts = parentTwitt.retwitts

        //Delete the current twitt with 'id' from the parent twitt
        let index = twitts.indexOf(thisTwitt)
        twitts.splice(index, 1)

        //Get all the cloned content of this twitt. Recall that these contents are inside retwitt objects
        let cloneTwitts = document.getElementsByClassName(`content-${thisTwitt.id}`)
        for (let i = 0; i < cloneTwitts.length; i++) {

            cloneTwitts[i].innerText = 'This content is not available anymore'
        }

        //Get the new cards div - update UI
        innerHTML = twitts.reduce((total, item) => {
            let outerHTML = document.getElementById(`card-${item.id}`).outerHTML
            return total += outerHTML
        }, '')

        //Update the UI
        parentCard.innerHTML = innerHTML

    } else if (thisTwitt.type === 'retwitt') {
        //Get an array of all twitts in parent twitt
        let twitts = parentTwitt.retwitts

        //Delete the current twitt with 'id' from the parent twitt
        let index = twitts.indexOf(thisTwitt)
        twitts.splice(index, 1)

        //Only update the number of retwitt to UI if it is retwitt
        document.getElementById(`ret-${parentTwitt.id}`).innerText = twitts.length

        //Update mainTwitt array since thisTwitt is in mainTwitt
        index = mainTwitt.retwitts.indexOf(thisTwitt)
        mainTwitt.retwitts.splice(index, 1)

        //Get the new cards div - update UI
        innerHTML = mainTwitt.retwitts.reduce((total, item) => {
            let outerHTML = document.getElementById(`card-${item.id}`).outerHTML
            return total += outerHTML
        }, '')

        //Update the UI - main Twitt
        document.getElementById('card-0').innerHTML = innerHTML

    } else {
        //Get an array of all comments in parent twitt
        let comments = parentTwitt.comments

        //Update the array
        let index = comments.indexOf(thisTwitt)
        comments.splice(index, 1)

        //Update the UI
        document.getElementById(`cmt-${parentTwitt.id}`).innerText = comments.length

        //Get the new cards div - update UI
        innerHTML = comments.reduce((total, item) => total += item.displayHTML(null), '')

        //Update the UI
        parentCard.innerHTML = parentBox.outerHTML + innerHTML
    }
}

//Function to create a new retwitt - CREATE NEW TWITT
function reTwitt(id) {
    //Get the user input
    let cmt = prompt('What do you want to retwitt: ')

    //Get the parent twitt and its card div
    let card = document.getElementById(`card-${mainTwitt.id}`)
    let thisTwitt = allTwitts[id]

    //Create a new twitt of type retwitt and also add this new twitt to the beginning of mainTwitt
    let newTwitt = new Twitter(cmt, 'retwitt', thisTwitt, 'Nguyen')
    mainTwitt.retwitts.unshift(newTwitt)

    //Indicate what this twitt being refered to a twitt that is commented
    newTwitt.setRefer(thisTwitt.hashTag)

    //Update the UI
    card.innerHTML = newTwitt.displayHTML(thisTwitt.displayRetwittHTML()) + card.innerHTML
}
