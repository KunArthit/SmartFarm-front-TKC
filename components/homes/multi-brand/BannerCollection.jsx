import { useTranslation } from 'react-i18next';
import React from 'react';
import wegive1 from '../../../public/images/collections/farmsuk02.png';
import wegive2 from '../../../public/images/collections/farmsuk03.png'
import wegive3 from '../../../public/images/collections/farmsuk04.png'
import Image from 'next/image';


const SmartFarmingSection = () => {
  const { t } = useTranslation();
  const features = [
    {
      id: 1,
      title: "Smart Farming",
      description: t("banner.description1"),
      image: wegive1,
    },
    {
      id: 2,
      title: "Marketplace",
      description: t("banner.description2"),
      image: wegive2,
    },
    {
      id: 3,
      title: "Smart Solution",
      description: t("banner.description3"),
      image: wegive3,
    }
  ];

  return (
    <div style={{
      width: '100%',
      position: 'relative',
      paddingTop: '44px',
      paddingBottom: '44px',
      backgroundImage: "url('https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&w=2000&q=80')",
      backgroundSize: "cover",
      backgroundPosition: "center",
    }}>
      {/* Dark overlay */}
      <div style={{
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        backgroundColor: 'rgba(50, 101, 50, 0.3)'
      }}></div>
      
      <div style={{
        position: 'relative',
        zIndex: 10,
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '0 32px'
      }}>
        <h1 style={{
          color: 'white',
          fontSize: '2.5rem',
          fontWeight: 'bold',
          textAlign: 'center',
          marginBottom: '6px'
        }}>
          {t("banner.header")}
        </h1>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '64px'
        }}>
          {features.map((feature) => (
            <div key={feature.id} style={{
              transition: 'transform 0.3s ease',
            }} onMouseOver={(e) => {e.currentTarget.style.transform = 'translateY(-8px)'}} 
               onMouseOut={(e) => {e.currentTarget.style.transform = 'translateY(0)'}}>
                <div style={{
                  position: 'relative'
                }}>
                  <Image
                    src={feature.image} 
                    alt={feature.title} 
                    style={{
                      width: '100%',
                      height: '224px',
                      objectFit: 'cover',
                      objectPosition: "center top"
                    }}
                  />
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    bottom: 0,
                    left: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <div style={{
                      width: '140px',
                      height: '140px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                    </div>
                  </div>
                </div>
                <div style={{
                  padding: '24px',
                  textAlign: 'center',
                  flexGrow: 1
                }}>
                  <h4 style={{
                    color: 'white',
                    fontSize: '1.5rem',
                    fontWeight: 'bold',
                    marginBottom: '6px'
                  }}>{feature.title}</h4>
                  <p style={{
                    color: '#ffff'
                  }}>{feature.description}</p>
                </div>
              </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SmartFarmingSection;