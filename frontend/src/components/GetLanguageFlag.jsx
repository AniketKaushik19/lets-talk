import React from 'react'
import { LANGUAGE_TO_FLAG } from '../constants';

const GetLanguageFlag = (language) => {
    if(!language) return null;

    const langlower=language.toLowerCase()
    const countryCode=LANGUAGE_TO_FLAG[langlower]
// console.log("Raw language:", language);
// console.log("langlower:", langlower);
// console.log("Keys in LANGUAGE_TO_FLAG:", Object.keys(LANGUAGE_TO_FLAG));
// console.log("Lookup result:", LANGUAGE_TO_FLAG[langlower]);
    if(countryCode){
        return (
            <img src={`https://flagcdn.com/24x18/${countryCode}.png`} alt={`${langlower} flag`} 
            className='n-3 mr-1 inline-block'/>
        )
    }
  return null
}

export default GetLanguageFlag