import React from 'react';
import './TrustedCompanies.css';

const TrustedCompanies = ({ className = "" }) => {
  // List of company logos
  const logos = [
    { id: 1, name: 'TCS', src: '/images/tcs.png' },
    { id: 2, name: 'Infosys', src: '/images/infosys.png' },
    { id: 3, name: 'Wipro', src: '/images/wipro.png' },
    { id: 4, name: 'Tech Mahindra', src: '/images/tech-mahindra.png' },
    { id: 5, name: 'LTI Mindtree', src: '/images/ltimindtree.png' },
    { id: 6, name: 'Oracle Financial Services', src: '/images/ofss.png' },
    { id: 7, name: 'L&T Technology Services', src: '/images/ltts.png' },
    { id: 8, name: 'Tata Technologies', src: '/images/tata-technologies.png' },
    { id: 9, name: 'Google', src: '/images/google.png' },
    { id: 10, name: 'IBM', src: '/images/ibm.png' },
    { id: 11, name: 'Amazon', src: '/images/amazon.png' },
    { id: 12, name: 'SAP', src: '/images/sap.png' },
    { id: 13, name: 'Adobe', src: '/images/adobe.png' },
    { id: 14, name: 'Salesforce', src: '/images/salesforce.png' },
    { id: 15, name: 'Dell', src: '/images/dell.png' },
    { id: 16, name: 'Deloitte', src: '/images/deloitte.png' },
    { id: 17, name: 'EY', src: '/images/ey.png' },
    // { id: 18, name: 'TCS', src: '/images/tcs2.png' }
  ];

  // Duplicate logos for seamless infinite scroll
  const doubledLogos = [...logos, ...logos];

  return (
    <section className={`trusted-companies ${className}`.trim()}>
      <div className="trusted-container">
        <div className="trusted-heading-wrapper">
          <h2 className="trusted-heading">Trusted by Leading Companies</h2>
        </div>
        
        <div className="trusted-marquee-wrapper">
          <div className="trusted-marquee-track">
            {doubledLogos.map((logo, index) => (
              <div 
                key={`${logo.id}-${index}`} 
                className="trusted-logo-item"
              >
                <img
                  src={logo.src}
                  alt={logo.name}
                  title={logo.name}
                  className="trusted-logo-image"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustedCompanies;
