// this component deals with showing of the UI part of the blog application like image and other responsive parts of code

import React from 'react'
import { useNavigate } from 'react-router-dom';
import Blog from '../../../assets/Post-cuate.png'
const Content = () => {
    const navigate = useNavigate();
    return (
        <div>
            <div className="max-w-7xl mx-auto px-8 py-12">
                <div className="flex flex-col md:flex-row items-center justify-between gap-7">
                    {/* Text Content */}
                    <div className="flex-1 space-y-4 text-left self-center">
                        <h4 className="text-3xl md:text-4xl font-extrabold text-gray-900">
                            Empowering Expression
                        </h4>
                        <b className="text-xl text-gray-800 block">
                            Write. Save. Publish — Effortlessly.
                        </b>
                        <p className="text-gray-600 leading-relaxed max-w-md whitespace-pre-line">
                            Our intuitive blog editor lets you focus on your words,
                            with features like real-time auto-save,
                            easy draft management,
                            and seamless publishing.
                        </p>
                        <i className="text-sm italic text-gray-500 block">
                            Write freely, edit smartly, and share your voice with the world.
                        </i>

                        <div className="flex justify-start gap-3 sm:gap-4 mt-6 sm:mt-10">
                            <button
                                onClick={() => navigate('/api/blogs')}
                                className="w-[130px] sm:w-[140px] md:w-[150px] lg:w-[160px] h-[44px] sm:h-[47px] bg-[#3E27FF] text-white rounded-full cursor-pointer transition-all duration-300 ease-in-out hover:bg-[#2E1ED9] hover:shadow-lg"
                            >
                                Retrieve all blogs
                            </button>
                            <button className="w-[130px] sm:w-[140px] md:w-[150px] lg:w-[160px] h-[44px] sm:h-[47px] bg-white text-[#3E27FF] border-2 border-[#3E27FF] rounded-full cursor-pointer transition-all duration-300 ease-in-out hover:bg-[#F3F4F6] hover:shadow-md"
                                onClick={() => navigate('/blog')}>
                                Create Blog
                            </button>
                        </div>
                    </div>

                    {/* Image Section */}
                    <div className="flex-1 pr-4 md:pr-0 md:pl-12">
                        <img
                            src={Blog}
                            alt="Blog illustration"
                            className="w-full max-w-sm md:max-w-md h-auto rounded-xl  object-cover mx-auto"
                        />
                    </div>
                </div>
            </div>

        </div>
    )
}

export default Content
