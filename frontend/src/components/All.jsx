// all the created components will be called here for isolation and routes creation

import React from 'react'
import Header from './header/Header'
import Main from './main/Main'
import BlogGrid from './main/section/BlogGrid'

const All = () => {
  return (
    <div>
      <div className='font-sans'>

        <Main />
        <div>
          <section id="blog"><BlogGrid /></section>
        </div>
        <div>
          {/* <Footer/> */}
        </div>
      </div>
    </div>
  )
}

export default All
