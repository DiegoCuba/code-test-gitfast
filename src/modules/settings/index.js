import React, { useEffect, useState, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Input } from 'reactstrap'
import { getRepositories } from '../../redux/repositories/actions'
import SpinnerLoading from '../../components/SpinnerLoading'


const clearText = (dirtyText) => {
    const inputText = dirtyText.replace(/[^a-zA-Z0-9-]/g, '')// Avoiding invalid URL characters 
    return inputText
}

export default function Settings() {
    const [page, setPage] = useState(1)
    const [userNameInput, setUserNameInput] = useState('DiegoCuba')
    const [searchingText, setSearchingText] = useState('DiegoCuba')
    const dispatch = useDispatch()
    const repositories = useSelector((state) => state.repositories.repositories)
    const loading = useSelector((state) => state.repositories.loading)
    const links = useSelector((state) => state.repositories.links)

    useEffect(() => {
        if (searchingText)  //If there is no UserName to search, avoid the unnecessary search
        {
            dispatch(getRepositories(page))

            console.log('SEARCHING...', searchingText)

        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page, searchingText])

    // console.log({ repositories, loading, links })

    const timeout = useRef();


    const searchInputHandler = (e) => {

        const inputText = clearText(e?.target?.value)

        setUserNameInput(inputText)// Making our Input Controlled

        timeout.current && clearTimeout(timeout.current);// Remove prev. setTimeout

        timeout.current = setTimeout(() => {

            setSearchingText(inputText || null)// If inputText is '', set as null so the input Looks like waiting for inputs

        }, 1000); // Just Search if User Stop Typing
    }

    const searchInputKeyUp = (e) => {
        const keyPressedCode = e.keyCode

        if (keyPressedCode === 13) {
            timeout.current && clearTimeout(timeout.current);// Remove prev. setTimeout
            const inputText = clearText(e?.target?.value)
            setSearchingText(inputText || null)// If inputText is '', set as null so the input Looks like waiting for inputs
        }

    }


    return (
        <div className='text-white'>
            <div className='d-flex align-items-center p-2'>
                <div className='w-75'>
                    <Input type="text"
                        className={userNameInput === searchingText
                            ? 'border border-3 shadow-none border-light'
                            : 'border border-3 shadow-none border-primary'}
                        value={userNameInput}
                        aria-label='UserName to search'
                        placeholder='UserName to search'
                        onChange={searchInputHandler}
                        onKeyUp={searchInputKeyUp}
                    />
                </div>

                <div className='d-flex mx-3'>
                    <div className='me-2'>Searching: </div>
                    <div className='text-primary'>{searchingText}</div>
                    <SpinnerLoading loading={loading} />
                </div>
            </div>
        </div>
    )
}
