import {PURPLE} from "../../helpers/colors";
import React from "react";

const SearchContact = () => {
    return (
        <div className='input-group mx-2 w-75' dir='ltr'>
            <span
                className='input-group-text'
                id='basic-addon1'
                style={{backgroundColor: PURPLE}}
            >
                <i className='fa fa-search'/>
            </span>
            <input
                dir='rtl'
                type='text'
                className='form-control'
                placeholder='جستجوی مخاطب'
                aria-label='Search'
                aria-describedby='basic-addon1'
            />
        </div>
    )
}

export default SearchContact;