//Add event listener
document.getElementById('dn-textarea').addEventListener("DOMCharacterDataModified", countText)
document.getElementById('dn-twitt-btn').addEventListener('click', twitt)

const allowTextDN = 140
let allTwitts = {}
//issue here!! how to know which account just signed in to call the right local object
//tuan
let localUserData = JSON.parse(window.localStorage.getItem('user'))
//this only show the latest sign up! not everything
let pic = localUserData.userPic
//tuan
document.getElementById("outProPic").setAttribute('src', pic)

//Function to make the program sleep for miliseconds
function sleep(miliseconds) {
  return new Promise(resolve => setTimeout(resolve, miliseconds))
}

//Main class as a template for any twitt object
class Twitter {
  constructor(content, type, parent, name) {
    this.links = []
    this.hashTags = []
    this.canTwitt = true;
    this.parent = parent
    this.type = type
    this.like = 0
    this.id = Date.now()
    this.retwitts = []
    this.comments = []
    this.htmls = []
    this.name = name
    this.content = this.searchHashtags(this.id, content)
    this.isClicked = false
    this.isRefer = ''
    this.hashTag = `@${this.name}`
    this.startTime = Date.now()
    this.elapseTime = 0

    //Set links for related nodes
    this.setLinks()

    //Update content to include iframe as well
    this.content += this.searchLinks(this.id, content)
  }
  //Update attributes of parent and child twitts when a new twitt is created
  setLinks() {
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
      //Add new twitt to the beginning of array of parent twitt
      this.parent.retwitts.unshift(this)
    }
    //Add to central database of all twitt objects - skipped the first obj whose parent is null
    allTwitts[this.id] = this
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

    let img = `<img class='dn-img' src='${pic}' alt='...' id='img-${this.id}'>`
    let name = `<span id='name-${this.id}' class='dn-name'>${this.name}</span>`
    let hashTag = `<a id='name-${this.id}' href='#' class='dn-hashtag'>${this.hashTag}</a>`
    let conT = `<p id='content-${this.id}' class='dn-content-in'>${this.content}</p>`
    let time = `<span id='time-${this.id}' class='dn-time'>${this.elapseTime}</span>`

    if (anotherContent !== null) {
      conT = `<p id='p-${this.id}' class='dn-content-in2' >${this.content}</p><div class='dn-wrapper' id='content-${this.id}'>${anotherContent}</div>`
    }

    let btnLike = `<button class ="far fa-heart btn-outline-dark dn-btn-lk" id='like-${this.id}' onclick='likeTwitt(${this.id})'> <span id='lk-${this.id}' class='dn-num-tt'>0</span></button>`
    let btnComment = `<button class="far fa-comments btn-outline-dark dn-btn-cmt" id='comment-${this.id}' onclick='commentTwitt(${this.id})'><span id='cmt-${this.id}' class='dn-num-tt'>0</span></button>`
    let btnDelete = `<button class="far fa-trash-alt btn-outline-dark dn-btn-dlt" id='delete-${this.id}' onclick='deleteTwitt(${this.id})'><span id='dlt-${this.id}' class='dn-num-tt'>0</span></button>`
    let reTwitt = `<button class="far fa-copy btn-outline-dark dn-btn-ret" id='retwitt-${this.id}' onclick='reTwitt(${this.id})'><span id='ret-${this.id}' class='dn-num-tt'>0</span></button>`

    let box = `
    <div class='card ${classTwitt}' id='card-${this.id}'>
      <div class='row no-gutters twitt-box' id='box-${this.id}'>
        <div class='col-md-2 dn-img-box'>${img}</div>
        <div class='col-md-10 dn-twitt-content'>
          <div class='dn-card-name'>${name} ${hashTag} - ${time}<p class='dn-refer'>${this.isRefer}</p></div>
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
    let img = `<img class='dn-img' src='/Img/nobita.png' alt='...' id='img-${this.id}'>`
    let name = `<span id='name-${this.id}' class='dn-name'>${this.name}</span>`
    let hashTag = `<a id='name-${this.id}' href='#' class='dn-hashtag'>${this.hashTag}</a>`
    let conT = `<p id='content-${this.id}' class='content-${this.id} dn-content'>${this.content}</p>`
    let time = `<span id='time-${this.id}' class='dn-time'>${this.elapseTime}</span>`

    //This card and box have different id for any reason
    let box = `
    <div class='card dn-retwitt-card-inside' id='card+${this.id}'>
      <div class='row no-gutters twitt-box' id='box+${this.id}'>
        <div class='col-md-3 dn-img-box'>${img}</div>
        <div class='col-md-9 dn-twitt-content'>
          <div class='dn-card-name'>${name} ${hashTag} - ${time}<p>${this.isRefer}</p></div>
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
  searchHashtags(id, content) {
    let words = this.splitString(content)
    // console.log(words)
    let output = words.reduce((total, item) => {
      if (item.charAt(0) === '#') {
        //Update the number of hashtags in a content
        this.hashTags.push(item)
        return total += `<a id='hashtag-${id}' href='#'>${item} </a>`
      }
      if (item.search('http') != -1 || item.search('https') != -1) {
        //Update the link
        this.links.push(item)
        return total += `<a id='link-${id}' href='${item}'>${item}</a>`
      }
      return total += item + ' '
    }, '')
    return output
  }
  //Function search for links embeded in content
  searchLinks(id, content) {
    let words = this.splitString(content)
    let output = ''
    for (let i = 0; i < words.length; i++) {
      if (words[i].search('http') != -1 || words[i].search('https') != -1) {
        output = `<iframe id='frame-${id}' src='${words[i].replace('watch?v=', 'embed/')}' title='IFrame' class='dn-iframe' frameborder='0'></iframe>`
      }
    }
    return output
  }
  //Function to help split the string when built-in split() does not work
  splitString(content) {
    //Declare all variables
    let j = 0; let i = 0
    let chars = content.split('')
    let result = []

    //Iterate through each character of content. If that char is space or special character (160), parse there
    for (i = 0; i < chars.length; i++) {
      if (content.charCodeAt(i) === 160 || content.charCodeAt(i) === 32) {
        result.push(chars.slice(j, i).join(''))
        j = i + 1
      }
    }

    // Add the last substring to result
    result.push(chars.slice(j, i).join(''))
    return result
  }
}
let mainTwitt = new Twitter('', 'twitt', null, 'DungNgo')
mainTwitt.id = 0

//Function create 4 defaults tweets in Twitter
async function creatDefaults() {
  //Create 4 default twitts - Trick: Since I initiate all 4 at once. it may have the same id -> Use sleep()
  let quocTwitt = new Twitter("Hello everyone. Nice to meet you all! https://www.coderschool.vn/en/ #MondayisFun #Twitter #CoderSchool #Team2", 'twitt', mainTwitt, 'Quoc Hoang')
  await sleep(50)

  let nguyenTwitt = new Twitter("Watch Nobita with me: https://www.youtube.com/watch?v=2wQ2isdUtwk  #Nobita #Xuka #Chaien #Doraemon #Summer2020", 'twitt', mainTwitt, 'Nguyen Le')
  await sleep(50)

  let tuanTiwtt = new Twitter("The coronavirus surges in the U.S. Checkout this link for more information. https://coronavirus.jhu.edu/  #JHU #Coronavius #Covid-19 #WearMaskPublicly", 'twitt', mainTwitt, 'Tuan Nguyen')
  await sleep(50)

  let dungTwitt = new Twitter('Watch this video: https://www.youtube.com/watch?v=6t-MjBazs3o  #CoChacLaYeuDay #SonTungMTP #SkyFan #SepOi #Summer2020', 'twitt', mainTwitt, 'Dung Ngo')
  await sleep(50)

  //Get the twitt area and add all twitts to that area
  let area = document.getElementById(`card-${mainTwitt.id}`)
  area.innerHTML = dungTwitt.displayHTML(null) + tuanTiwtt.displayHTML(null) + nguyenTwitt.displayHTML(null) + quocTwitt.displayHTML(null) + area.innerHTML

  //Reset and update time
  resetTwitt()
  updateTime()
}
creatDefaults()

//Function to count the number of text left
function countText() {
  let textarea = document.getElementById('dn-textarea')
  let numCount = textarea.innerText.split('').length
  let countText = document.getElementById('dn-count-text')

  //Set the color of text count
  if (allowTextDN < numCount) {
    countText.style.color = 'red'
  } else {
    countText.style.color = 'black'
  }

  //Record the number of remaining words 
  document.getElementById('dn-count-text').innerHTML = allowTextDN - numCount
  document.getElementById('dn-count-text').style.color = '#16a2f2'
}

//Function to create a new Twitt if user clicks Twitt - CREAT NEW TWITT
function twitt() {
  //Get the twitt area
  let area = document.getElementById(`card-${mainTwitt.id}`)

  //Check if user can twitt. If not, alert the user, reset Tweet board, and return immediately
  let wordNum = document.getElementById('dn-textarea').innerText.split('').length
  if (wordNum > allowTextDN) {
    alert("Can't tweet. Maximum number of characters in a tweet is 140.")
    resetTwitt()
    return
  } else if (wordNum === 0) {
    alert("Please enter something in the textbox before tweeting.")
    resetTwitt()
    return
  }

  //Get the content user wants to twitt
  let content = document.getElementById('dn-textarea').innerText

  //Create a new twitt object //tuan
  let newTwitt = new Twitter(content, 'twitt', mainTwitt, `${localUserData.userName}`)
  // let newTwitt = new Twitter(content, 'twitt', mainTwitt, 'Luke Nguyen')

  //Update the UI and reset UI
  area.innerHTML = newTwitt.displayHTML(null) + area.innerHTML
  resetTwitt()

  //Update time
  updateTime()
}

//Function to reset the tweet board
function resetTwitt() {
  document.getElementById('dn-count-text').innerHTML = 140
  document.getElementById('dn-textarea').innerHTML = ''
  document.getElementById('dn-count-text').style.color = '#16a2f2'
}

//Function renders when user clicks like a twitt
function likeTwitt(id) {
  //Check if a twitt still exists. If not, return immediately
  if (!stillExist(id)) {
    alert("This tweet is not available!")
    return;
  }

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

  //Update time
  updateTime()
}

//Function renders when user clicks comment button of twitt with 'id' - CREATE NEW TWITT
function commentTwitt(id) {
  //Check if a twitt still exists. If not, return immediately
  if (!stillExist(id)) {
    alert("This tweet is not available!")
    return;
  }

  //Ask the user for input
  let cmt = prompt('What do you think about this twitt: ')

  //Get the twitt that user want to comment on
  let card = document.getElementById(`card-${id}`)
  let thisTwitt = allTwitts[id]

  //Create a new twitt with 'comment' type
  let newComment = new Twitter(cmt, 'comment', thisTwitt, `${localUserData.userName}`)

  //Indicate what this twitt being refered to a twitt that is commented
  newComment.setRefer(thisTwitt.hashTag)

  //Add new comment to commented twitt
  card.innerHTML = card.innerHTML + newComment.displayHTML(null)

  //Update time
  updateTime()
}

//Function renders when user clicks delete a twitt
async function deleteTwitt(id) {
  //Check if a twitt still exists. If not, return immediately
  if (!stillExist(id)) {
    alert("This tweet is not available!")
    return;
  }

  //Get the twitt with 'id'
  let thisTwitt = allTwitts[id]
  let innerHTML = ''

  //Get the parent twitt
  let parentTwitt = thisTwitt.parent

  //Get card div of parent twitt. Recall: card is the wrapper of box
  let parentCard = document.getElementById(`card-${parentTwitt.id}`)
  let parentBox = document.getElementById(`box-${parentTwitt.id}`)

  //delete twitt with 'id' and hide it away
  delete allTwitts[id]
  $(`#card-${id}`).first().hide(1000)
  await sleep(1000)

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

    //Delete all twitts that are retwitts of thisTwitt (children of thisTwitt)
    let childrenTwitts = thisTwitt.retwitts
    for (let i = 0; i < childrenTwitts.length; i++) {
      let childTwitt = childrenTwitts[i]
      delete allTwitts[childTwitt.id]
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

  //Update time
  updateTime()
}

//Function to create a new retwitt - CREATE NEW TWITT
function reTwitt(id) {
  //Check if a twitt still exists. If not, return immediately
  if (!stillExist(id)) {
    alert("This tweet is not available!")
    return;
  }

  //Get the user input
  let cmt = prompt('What do you want to retwitt: ')

  //Get the parent twitt and its card div
  let card = document.getElementById(`card-${mainTwitt.id}`)
  let thisTwitt = allTwitts[id]

  //Create a new twitt of type retwitt and also add this new twitt to the beginning of mainTwitt
  let newTwitt = new Twitter(cmt, 'retwitt', thisTwitt, `${localUserData.userName}`)
  mainTwitt.retwitts.unshift(newTwitt)

  //Indicate what this twitt being refered to a twitt that is commented
  newTwitt.setRefer(thisTwitt.hashTag)

  //Update the UI
  card.innerHTML = newTwitt.displayHTML(thisTwitt.displayRetwittHTML()) + card.innerHTML

  //Update time
  updateTime()
}

//Function to update elapsed time of all twitts
function updateTime() {
  keys = Object.keys(allTwitts)
  for (let i = 0; i < keys.length; i++) {
    //Get the html tag with id of 'time-id'
    let timeTag = document.getElementById(`time-${keys[i]}`)

    //Get the twitt object
    let twitt = allTwitts[keys[i]]

    //Calculate the elapsed time, starting from the time this twitt is created
    twitt.elapseTime = convertTime(Date.now() - twitt.startTime)

    //Update the UI
    timeTag.innerHTML = twitt.elapseTime
  }
}

//Function to covert from miliseconds to seconds or minutes or hours or days
function convertTime(miliseconds) {
  //Convert to seconds, minutes, hours, and days
  let seconds = parseInt(Math.floor(miliseconds / 1000))
  let minutes = parseInt(Math.floor(seconds / 60))
  let hours = parseInt(Math.floor(minutes / 60))
  let days = parseInt(Math.floor(hours / 24))

  //Set timetable object
  let time = {
    'seconds': `${seconds} seconds ago`,
    'minutes': `${minutes} minutes ago`,
    'hours': `${hours} hours ago`,
    'days': `${days} days ago`
  }

  //Get keys
  let keys = Object.keys(time)

  //Iterate through timetable
  for (let i = 0; i < keys.length; i++) {
    let str = time[keys[i + 1]].split(' ')
    if (parseInt(str[0]) === 0) return time[keys[i]]
  }
  return time['days']
}

//Function to check a twitt actually exists or not
function stillExist(id) {
  let keys = Object.keys(allTwitts)
  for (let i = 0; i < keys.length; i++) {
    if (id == keys[i]) return true
  }
  return false
}

//This part illustrate the sliding trending bars
let lst = ['trending1', 'trending2', 'trending3', 'trending4']

//Function to keep the bar sliding - Recursion
async function cycle(N) {
  //Sleep for 1s until next section
  await sleep(N)

  //Remove the first element of a list
  let elt = lst.shift()
  let li = $(`#${elt}`).first()
  let lastli = $(`#last-li`).first()

  //Hide the removed bar and sleep for 1s to avoid time collision -> then remove it from HTML
  li.hide(N);
  await sleep(N);
  li.detach()

  //Make the deleted bar disappear
  li.attr('style', 'display:none')
  lastli.before(li)

  //Show the bar for 1s and sleep for 1s to avoid time collision
  li.show(N);
  await sleep(N)

  //Push the deleted to the end of the list
  lst.push(elt)
  cycle(N)
}
cycle(2000)