import React from 'react'
import Hero from '../../components/student/Hero'
import Companies from '../../components/student/Companies'
import CouresesSection from '../../components/student/CouresesSection'
import TestimonialsSection from '../../components/student/TestimonialsSection'
import CallToAction from '../../components/student/CallToAction'
import Footer from '../../components/student/Footer'

const Home = () => {
  return (
    <div className='flex flex-col items-center space-y-7 text-center'>
       <Hero/>
       <Companies/>
       <CouresesSection/>
       <TestimonialsSection/>
       <CallToAction/>
       <Footer/>
    </div>
  )
}

export default Home
