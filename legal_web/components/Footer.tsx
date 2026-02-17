"use client"
import { Mail, Phone, MapPin, Hash, Instagram } from 'lucide-react';
import Link from 'next/link'
import HashLink from './HashLink';
import { useRouter } from 'next/navigation'

const Footer = () => {
  const navigate = useRouter()
  return (
    <footer className="bg-black text-white pt-16 pb-8">
      {/* <ScrollToHashElement/> */}
      <div className="container-custom">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          <div>
            <div className="mb-2 ">
              <img src="/logo3.avif" alt="logo" className="h-auto w-[250px]" />
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-6">Quick Links</h3>
            <ul className="space-y-3">
              <li><HashLink to="/#" className="text-gray-400 hover:text-white transition-colors">Home</HashLink></li>
              <li><Link href="/#expertise" className="text-gray-400 hover:text-white transition-colors"
              >Areas of Expertise</Link></li>
              <li><HashLink to="/nri-services" className="text-gray-400 hover:text-white transition-colors">NRI Services</HashLink></li>
              <li><HashLink to="/#jplaw" className="text-gray-400 hover:text-white transition-colors"
                offset={-40}>Why JP Law Suvidha</HashLink></li>

              <li><HashLink to="/contact_us" className="text-gray-400 hover:text-white transition-colors">Contact Us</HashLink></li>

            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-6">Practice Areas</h3>
            <ul className="space-y-3">
              {/* <li><a href="#expertise" className="text-gray-400 hover:text-white transition-colors">Family Law</a></li> */}
              <li> <HashLink to="/#expertise" className="text-gray-400 hover:text-white transition-colors"
                offset={100}>Family Law</HashLink></li>
              <li><HashLink to="/#expertise" className="text-gray-400 hover:text-white transition-colors"
              >Corporate Law</HashLink></li>
              <li><HashLink to="/#expertise" className="text-gray-400 hover:text-white transition-colors"
              >Criminal Law</HashLink></li>
              <li><HashLink to="/#expertise" className="text-gray-400 hover:text-white transition-colors"
                offset={800}>Civil Law</HashLink></li>
              <li><HashLink to="/#expertise" className="text-gray-400 hover:text-white transition-colors"
                offset={800} >Business Law</HashLink></li>
              {/* <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Labour Law</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Tax Law</a></li> */}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-6">Contact Us</h3>
            <ul className="space-y-4">

              <li className="flex ">
                <MapPin className="w-6 h-6 mr-3 text-gray-400" />
                <Link className="flex flex-col cursor-pointer text-gray-400 hover:text-white transition-colors" href='https://share.google/sXlC7rIUUxNSP2Ich' target='_blank' rel='noopener noreferrer'>
                  <span>Vanasthalipuram, Hyderabad,</span>
                  <span>Telangana,</span>
                  <span>India - 500070</span>
                </Link>
              </li>
              <li className="flex">
                <Phone className="w-5 h-5 mr-3 text-gray-400" />
                <a href="tel:+918019097373" className="text-gray-400 hover:text-white transition-colors">+91 8019097373</a>
              </li>
              <li className="flex ">
                <Mail className="w-5 h-5 mr-3 text-gray-400" />
                <a href="mailto:support@jplawsuvidha.com" className="text-gray-400 hover:text-white transition-colors break-all">support@jplawsuvidha.com</a>
              </li>
              <div className="flex gap-4 flex-wrap">
                <a href="https://www.linkedin.com/company/jp-law-suvidha/about/"
                  target='_blank'
                  rel='noopener noreferrer'
                  className="w-10 h-10 rounded-full bg-[#0077B5] flex items-center justify-center hover:opacity-80 transition-all duration-200">
                  <span className="sr-only">LinkedIn</span>
                  <svg className="w-5 h-5" fill="white" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="https://youtube.com/@jplawsuvidha?si=Xg-wOQF_fJnYD_hj" target="_blank" rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-[#FF0000] flex items-center justify-center hover:opacity-80 transition-all duration-200">
                  <span className='sr-only'>Youtube</span>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg " aria-hidden='true'>
                    <path d="M23.5 6.2s-.2-1.6-.9-2.3c-.9-.9-1.9-.9-2.4-1C16.5 2.5 12 2.5 12 2.5h-.1s-4.5 0-8.1.4c-.5.1-1.5.1-2.4 1C.7 4.6.5 6.2.5 6.2S.2 7.8.2 9.5v1c0 1.7.3 3.3.3 3.3s.2 1.6.9 2.3c.9.9 2.1.9 2.7 1C7.5 17.5 12 17.5 12 17.5s4.5 0 8.1-.4c.5-.1 1.5-.1 2.4-1 .7-.7.9-2.3.9-2.3s.3-1.6.3-3.3v-1c0-1.7-.3-3.3-.3-3.3zM9.75 13.5v-5l5 2.5-5 2.5z" />
                  </svg>
                </a>
                <a href="https://x.com/jplawsuvidha_in"
                  target="_blank"
                  rel="noopener noreferrer"

                  className="w-10 h-10 rounded-full bg-[#000000] flex items-center justify-center hover:opacity-80 transition-all duration-200 border border-white/20">
                  <span className="sr-only">Twitter</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="white" viewBox="0 0 24 24">
                    <path d="M19.782 3H23L14.877 10.67 24 21h-7.238l-5.67-6.38L4.8 21H1l9.706-8.91L0 3h7.407l5.1 5.748L19.782 3zm-2.17 16.125h2.005L6.25 4.74H4.117l13.495 14.385z" />
                  </svg>
                </a>
                <a
                  href="https://www.instagram.com/jplawsuvidha"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] flex items-center justify-center hover:opacity-80 transition-all duration-200 overflow-hidden"
                >
                  <span className="sr-only">Instagram</span>
                  <Instagram className="w-5 h-5 text-white" />
                </a>


                <a
                  href="https://www.facebook.com/61579231556644/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-[#1877F2] flex items-center justify-center hover:opacity-80 transition-all duration-200"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="white"
                    aria-hidden="true"
                  >
                    <path d="M22.675 0h-21.35C.595 0 0 .594 0 1.326v21.348C0 23.406.595 24 1.325 24h11.495v-9.294H9.692V11.01h3.128V8.309c0-3.1 1.894-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24h-1.918c-1.505 0-1.797.716-1.797 1.765v2.314h3.587l-.467 3.696h-3.12V24h6.116C23.405 24 24 23.406 24 22.674V1.326C24 .594 23.405 0 22.675 0z" />
                  </svg>
                </a>

              </div>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/20 pt-7 flex gap-10">
          <div className="text-gray-400 text-sm text-center md:text-left">
            &copy; {new Date().getFullYear()} JP Law Suvidha. All rights reserved.
          </div>
          <div className="flex gap-4 sm:gap-10 flex-wrap">
            <Link href="/privacy-policy" className="underline">Privacy Policy</Link>
            <Link href="/disclaimers" className="underline">Disclaimer</Link>
            <Link href="/user-agreement" className="underline">User Agreement</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

