// this component embeds the content component, which is reusable pice of code for simplicity

import React from 'react'
import Content from './contentArea/Content'

const Main = () => {
    return (
        <div>
            <div>
            <div><Content/></div>
            <h1 className="snap-center text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-center text-gray-800">
                Welcome to Blog Editor Page
            </h1>
        </div>
        </div>
    )
}

export default Main
