import React from 'react';
import '../styles/Homepage.css';
import SearchBar from '../components/SearchBar';
import ImgMediaCard from '../components/RecommendCards';
import PopularCards from '../components/PopularCards';
import { Button } from '@mui/material';

// components
//import Reviews from '../components/ReviewCards';
import Footer from '../components/Footer';
import TourCards from '../components/TourPackagesCards'
import TourReviews from '../components/TourReviews';
import TourPackages from '../components/TourPackagesCards';


/* ikonice */
import BeenhereOutlinedIcon from '@mui/icons-material/BeenhereOutlined';
import RouteOutlinedIcon from '@mui/icons-material/RouteOutlined';
import TuneOutlinedIcon from '@mui/icons-material/TuneOutlined';

  
const Homepage = () => {
  return (
    <div className='parent-container'>
      <div className="welcome-container">
        <h1 className="welcome-text">Adventure begins here.</h1>
        <div className='searchbar'>
          <SearchBar />
        </div>
      </div>

      {/* Today recommendations */}
      <div className="grid-container-1">
        <ImgMediaCard />
        <div className="right-container">
          <h1 style={{ marginLeft: '20px', fontFamily: 'Montserrat' }}>Best Of the Day</h1>
          <p className='text-paragraph'>Let's spend your money and relieve your stress by <br></br> going around the view.</p>
          <div className='grid-container-3'>
          <div>
            <h1 className='text-1'>60+</h1>
            <p className="text-paragraph-1">Destinations</p>
          </div>
          <div>
            <h1 className='text-1'>150+</h1>
            <p className="text-paragraph-1">Tourists</p>
          </div>
          <div>
            <h1 className='text-1'>100+</h1>
            <p className="text-paragraph-1">Packages</p>
          </div>
          </div>
          <Button href='/AboutUs' style={{ marginTop: '20px', marginLeft: '20px', border: '1px solid #4F6F52', borderRadius: '20px', background: '#4F6F52', color: 'white', padding: '10px 30px' }}>Contact Us</Button>
        </div>
      </div>

      {/* About Us */}
      <div className="grid-container-1">
        <div className="left-container">
        <h3>About Us</h3>
        <h1>Explore All Cornes Of <br></br>BiH with Us</h1>
        </div>
        <div className="right-container-2">
          <p className='text-paragraph'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Ex praesentium nam laudantium dicta nobis corrupti exercitationem eaque. Quos blanditiis in vel iure sint, totam a aliquid nemo voluptas nam magnam..</p>
          <p className='text-paragraph'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Ex praesentium nam laudantium dicta nobis corrupti exercitationem eaque. Quos blanditiis in vel iure sint, totam a aliquid nemo voluptas nam magnam..</p>
          <Button href='/AboutUs' style={{ marginTop: '20px', marginLeft: '20px', border: '1px solid #4F6F52', borderRadius: '20px', background: '#4F6F52', color: 'white', padding: '10px 30px' }}>Learn More</Button>
        </div>
      </div>

      <div className="grid-container">
        <div className="image">
          <img src="../src/img/route.png" alt="route" />
        </div>
        <div className="text">
          <h1 style={{ fontFamily: 'Montserrat', marginTop:'40px' }}>How to do it?</h1>
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime qui fuga in esse <br></br> nihil optio quaerat sint a. Sunt perspiciatis iste incidunt error. Magnam repellat perferendis saepe rerum dolor laudantium.</p>
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime qui fuga in esse <br></br> nihil optio quaerat sint a. Sunt perspiciatis iste incidunt error. Magnam repellat perferendis saepe rerum dolor laudantium.</p>
          <Button style={{ marginTop: '20px', marginLeft: '20px', border: '1px solid #515d57', borderRadius: '20px', background: '#4F6F52', color: 'white', padding: '10px 30px' }}>See more</Button>
        </div>
      </div>

      {/* Our services */}
      <div className='grid-container-3'>
        <div className='left-container-2'>
          <BeenhereOutlinedIcon style={{ fontSize:'50px', color:'#4F6F52'}} />
          <h2>Enjoy some flexibility</h2>
          <p>Stays with flexible cancellation <br></br> make it easy to re-book if your <br></br> plans change.</p>
        </div>
        <div className='inner-container'>
          <RouteOutlinedIcon style={{ fontSize:'50px', color:'#4F6F52'}} />
          <h2>More than 100 active <br></br> trip</h2>
          <p>More than thousand guests who've <br></br> found gateways in over 100 <br></br> destinations. </p>
        </div>
        <div className="right-container-3">
          <TuneOutlinedIcon style={{ fontSize:'50px', color:'#4F6F52'}} />
          <h2>100+ filters for tailored tours</h2>
          <p>Pick your price range, the number <br></br> of friends you want to go with, and other key <br></br> options that fit your needs. </p>
        </div>
      </div>

      {/* Popular destinations */}
      <div className='popular-container'>
          <h3>WHERE TO GO</h3>
          <h1>Popular destinations.</h1>
          <PopularCards />
          <div className='button'>
          <Button style={{ marginTop: '20px', marginLeft: '20px', border: 'none', color: '#4F6F52', padding: '10px 30px'}} >See More</Button>
</div>
        </div>

        {/* Tour Package */}
        <h1 className='additional-content'>Our Packages</h1>
        <TourCards />

        {/* Tour reviews */}
        {/* <div className='review-container' style={{backgroundColor:"white"}}>
          <h1>Tour reviews</h1>
          <TourReviews />
        </div> */}
        
        {/* What do they say? */}
        {/* <div className='review-container'>
          <h1>What do they say?</h1>
          <Reviews />
        </div> */}
                <div className='review-container'>
          <h1>What do they say?</h1>
          <TourReviews />
        </div>

      {/* quote */}
    <div className='quote'>
      <h1>Prepare yourself and let's explore  the<br></br> beauty of Bosnia and Herzegovina</h1>
      <p>Lorem Ipsum is Lorem Ipsum and Lorem Ipsum is</p>
      <div className='subscribe'>
      <input className="input" name="myInput" placeholder='Your email' />
      <Button style={{  border: '1px solid #515d57', background: '#4F6F52', color: 'white',  width: '150px', height: '50px'}}>Subscribe</Button>
      </div>

      {/* footer */}
      <div className='footer'>
        <Footer />
      </div>
    </div>
    </div>
  );
};

export default Homepage;