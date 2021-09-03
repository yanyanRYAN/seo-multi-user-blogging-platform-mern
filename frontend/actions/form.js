//auth related methods in here
import fetch from 'isomorphic-fetch';

//bring in API from our config
import {API} from '../config';



export const emailContactForm = (data) => {
    //takes in blog and token of user

    let emailEndpoint;
    if(data.authorEmail) {
        //If contacting author of blog
        emailEndpoint = `${API}/contact-blog-author`
    } else {
        //If contacting site admin - regular contact form
        emailEndpoint = `${API}/contact`
    }

    return fetch(`${emailEndpoint}`, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            //takes in form data so no need for content type
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        
        return response.json()
    })
    .catch(err => console.log(err))
}