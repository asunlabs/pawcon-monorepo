// Artwork images
import one from '../../assets/img/slider/1.gif'
import two from '../../assets/img/slider/2.gif'
import three from '../../assets/img/slider/3.gif'
import four from '../../assets/img/slider/4.gif'

export const themeContext = { 
    "backgroundColor" : "green"
} as React.CSSProperties

export const artworkContext = [
    {id : 1, title: "Cat The Chimney", description : "No cat more adorable than me.", author:"Jake", date:"2021.11.15", image : one},
    {id : 2, title: "Mr.Gentle", description : "Come see my paws here", author:"Jake", date:"2011.03.22", image : two},
    {id : 3, title: "The Cat Meme", description : "Yeah, I'm that cat meme.", author:"Jake", date:"2015.09.22", image : three},
    {id : 4, title: "Quiet Pranky", description : "Shhh, everybody quiet here", author:"Jake", date:"2033.02.16", image : four},
]