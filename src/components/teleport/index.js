import React from 'react'
import Head from 'next/head'

import Script from 'dangerous-html/react'
import { useTranslations } from 'next-intl'

import Navigation from '../components/navigation'
import Footer from '../components/footer'

const Home = (props) => {
  const translate = useTranslations()
  return (
    <>
      <div className="home-container1">
        <Head>
          <title>Informal Dizzy Tapir</title>
          <meta property="og:title" content="Informal Dizzy Tapir" />
          <link
            rel="canonical"
            href="https://informal-dizzy-tapir-m7svrm.teleporthq.app/"
          />
        </Head>
        <Navigation locale={props?.locale ?? ''}></Navigation>
        <main className="facinations-page">
          <section className="hero-section">
            <div className="hero-video-wrapper">
              <video
                autoPlay="true"
                loop="true"
                muted="true"
                playsInline="true"
                poster="https://images.pexels.com/videos/9965968/pictures/preview-0.jpeg"
                src="https://videos.pexels.com/video-files/9965968/9965968-hd_1280_720_50fps.mp4"
                className="hero-bg-video"
              ></video>
              <div className="hero-overlay"></div>
            </div>
            <div className="hero-container">
              <div className="hero-content-block">
                <div className="hero-badge">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                  >
                    <g
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                    >
                      <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"></path>
                      <path d="m9 12l2 2l4-4"></path>
                    </g>
                  </svg>
                  <span>
                    <span
                      dangerouslySetInnerHTML={{
                        __html: translate.raw('text_hZSyFk'),
                      }}
                    ></span>
                  </span>
                </div>
                <h1 className="hero-title">
                  <span
                    dangerouslySetInnerHTML={{
                      __html: translate.raw('HeroTitle_fpiovv'),
                    }}
                  ></span>
                </h1>
                <p className="hero-subtitle">
                  <span
                    dangerouslySetInnerHTML={{
                      __html: translate.raw('HeroSubtitle_pAnfkb'),
                    }}
                  ></span>
                </p>
                <div className="hero-actions">
                  <a href="#gallery">
                    <div className="btn btn-lg btn-primary">
                      <span>
                        <span
                          dangerouslySetInnerHTML={{
                            __html: translate.raw('text_M76O1d'),
                          }}
                        ></span>
                      </span>
                    </div>
                  </a>
                  <a href="#vault">
                    <div className="btn btn-lg btn-outline">
                      <span>
                        <span
                          dangerouslySetInnerHTML={{
                            __html: translate.raw('text_B552zE'),
                          }}
                        ></span>
                      </span>
                    </div>
                  </a>
                </div>
              </div>
            </div>
          </section>
          <section id="gallery" className="gallery-section">
            <div className="gallery-header">
              <h2 className="section-title">
                <span
                  dangerouslySetInnerHTML={{
                    __html: translate.raw('SectionTitle_lQ1jbw'),
                  }}
                ></span>
              </h2>
              <p className="section-subtitle">
                <span
                  dangerouslySetInnerHTML={{
                    __html: translate.raw('SectionSubtitle_c4eCwT'),
                  }}
                ></span>
              </p>
            </div>
            <div className="gallery-grid">
              <div className="gallery-item">
                <img
                  src="https://images.pexels.com/photos/10053361/pexels-photo-10053361.jpeg?auto=compress&amp;cs=tinysrgb&amp;w=1500"
                  alt="Golden sphere in geometric cage"
                  className="gallery-img"
                />
                <div className="gallery-info">
                  <h3 className="gallery-item-title">
                    <span
                      dangerouslySetInnerHTML={{
                        __html: translate.raw('GalleryItemTitle_DfwlUw'),
                      }}
                    ></span>
                  </h3>
                  <p className="gallery-meta">
                    <span
                      dangerouslySetInnerHTML={{
                        __html: translate.raw('GalleryMeta_mM-4nj'),
                      }}
                    ></span>
                  </p>
                </div>
              </div>
              <div className="gallery-item">
                <img
                  src="https://images.pexels.com/photos/2684385/pexels-photo-2684385.jpeg?auto=compress&amp;cs=tinysrgb&amp;w=1500"
                  alt="Abstract cloud display"
                  className="gallery-img"
                />
                <div className="gallery-info">
                  <h3 className="gallery-item-title">
                    <span
                      dangerouslySetInnerHTML={{
                        __html: translate.raw('GalleryItemTitle_txeeHJ'),
                      }}
                    ></span>
                  </h3>
                  <p className="gallery-meta">
                    <span
                      dangerouslySetInnerHTML={{
                        __html: translate.raw('GalleryMeta__PuFyY'),
                      }}
                    ></span>
                  </p>
                </div>
              </div>
              <div className="gallery-item">
                <img
                  src="https://images.pexels.com/photos/15271730/pexels-photo-15271730.jpeg?auto=compress&amp;cs=tinysrgb&amp;w=1500"
                  alt="Golden sculptures"
                  className="gallery-img"
                />
                <div className="gallery-info">
                  <h3 className="gallery-item-title">
                    <span
                      dangerouslySetInnerHTML={{
                        __html: translate.raw('GalleryItemTitle_tIHCCi'),
                      }}
                    ></span>
                  </h3>
                  <p className="gallery-meta">
                    <span
                      dangerouslySetInnerHTML={{
                        __html: translate.raw('GalleryMeta_xcqIRN'),
                      }}
                    ></span>
                  </p>
                </div>
              </div>
              <div className="gallery-item">
                <img
                  src="https://images.pexels.com/photos/11167639/pexels-photo-11167639.jpeg?auto=compress&amp;cs=tinysrgb&amp;w=1500"
                  alt="Surreal ethereal portrait"
                  className="gallery-img"
                />
                <div className="gallery-info">
                  <h3 className="gallery-item-title">
                    <span
                      dangerouslySetInnerHTML={{
                        __html: translate.raw('GalleryItemTitle_H08t6K'),
                      }}
                    ></span>
                  </h3>
                  <p className="gallery-meta">
                    <span
                      dangerouslySetInnerHTML={{
                        __html: translate.raw('GalleryMeta_nTyDy0'),
                      }}
                    ></span>
                  </p>
                </div>
              </div>
              <div className="gallery-item">
                <img
                  src="https://images.pexels.com/photos/375890/pexels-photo-375890.jpeg?auto=compress&amp;cs=tinysrgb&amp;w=1500"
                  alt="Metallic sculpture patterns"
                  className="gallery-img"
                />
                <div className="gallery-info">
                  <h3 className="gallery-item-title">
                    <span
                      dangerouslySetInnerHTML={{
                        __html: translate.raw('GalleryItemTitle_Se5b2K'),
                      }}
                    ></span>
                  </h3>
                  <p className="gallery-meta">
                    <span
                      dangerouslySetInnerHTML={{
                        __html: translate.raw('GalleryMeta_TA0evs'),
                      }}
                    ></span>
                  </p>
                </div>
              </div>
              <div className="gallery-item">
                <img
                  src="https://images.pexels.com/photos/9965979/pexels-photo-9965979.jpeg?auto=compress&amp;cs=tinysrgb&amp;w=1500"
                  alt="Black and gold paint swirls"
                  className="gallery-img"
                />
                <div className="gallery-info">
                  <h3 className="gallery-item-title">
                    <span
                      dangerouslySetInnerHTML={{
                        __html: translate.raw('GalleryItemTitle_wrHu7o'),
                      }}
                    ></span>
                  </h3>
                  <p className="gallery-meta">
                    <span
                      dangerouslySetInnerHTML={{
                        __html: translate.raw('GalleryMeta_KteRZu'),
                      }}
                    ></span>
                  </p>
                </div>
              </div>
            </div>
            <div className="gallery-footer">
              <a href="/gallery">
                <div className="btn btn-secondary">
                  <span>
                    <span
                      dangerouslySetInnerHTML={{
                        __html: translate.raw('text_eZvdi8'),
                      }}
                    ></span>
                  </span>
                </div>
              </a>
            </div>
          </section>
          <section id="vault" className="portfolio-section">
            <div className="portfolio-container">
              <div className="portfolio-intro">
                <h2 className="section-title">
                  <span
                    dangerouslySetInnerHTML={{
                      __html: translate.raw('SectionTitle_gg-6qo'),
                    }}
                  ></span>
                </h2>
                <p className="section-content">
                  <span
                    dangerouslySetInnerHTML={{
                      __html: translate.raw('SectionContent_wDxGSU'),
                    }}
                  ></span>
                </p>
              </div>
              <div className="portfolio-grid">
                <div className="portfolio-card">
                  <div className="portfolio-visual">
                    <img
                      src="https://images.pexels.com/photos/1108313/pexels-photo-1108313.jpeg?auto=compress&amp;cs=tinysrgb&amp;w=1500"
                      alt="Gold ripple coin"
                    />
                  </div>
                  <div className="portfolio-details">
                    <span className="portfolio-tag">
                      <span
                        dangerouslySetInnerHTML={{
                          __html: translate.raw('PortfolioTag_OG4HQV'),
                        }}
                      ></span>
                    </span>
                    <h3 className="portfolio-item-name">
                      <span
                        dangerouslySetInnerHTML={{
                          __html: translate.raw('PortfolioItemName_I5J51r'),
                        }}
                      ></span>
                    </h3>
                    <p className="section-content">
                      <span
                        dangerouslySetInnerHTML={{
                          __html: translate.raw('SectionContent_BM_j7h'),
                        }}
                      ></span>
                    </p>
                    <a href="/vault/genesis">
                      <div className="btn-link">
                        <span>
                          <span
                            dangerouslySetInnerHTML={{
                              __html: translate.raw('text_rShw4C'),
                            }}
                          ></span>
                        </span>
                      </div>
                    </a>
                  </div>
                </div>
                <div className="portfolio-card">
                  <div className="portfolio-visual">
                    <img
                      src="https://images.pexels.com/photos/4046688/pexels-photo-4046688.jpeg?auto=compress&amp;cs=tinysrgb&amp;w=1500"
                      alt="Textured abstract pattern"
                    />
                  </div>
                  <div className="portfolio-details">
                    <span className="portfolio-tag">
                      <span
                        dangerouslySetInnerHTML={{
                          __html: translate.raw('PortfolioTag_RfpubQ'),
                        }}
                      ></span>
                    </span>
                    <h3 className="portfolio-item-name">
                      <span
                        dangerouslySetInnerHTML={{
                          __html: translate.raw('PortfolioItemName_6YEVyw'),
                        }}
                      ></span>
                    </h3>
                    <p className="section-content">
                      <span
                        dangerouslySetInnerHTML={{
                          __html: translate.raw('SectionContent_fyw8oB'),
                        }}
                      ></span>
                    </p>
                    <a href="/vault/obsidian">
                      <div className="btn-link">
                        <span>
                          <span
                            dangerouslySetInnerHTML={{
                              __html: translate.raw('text_j3c74E'),
                            }}
                          ></span>
                        </span>
                      </div>
                    </a>
                  </div>
                </div>
                <div className="portfolio-card">
                  <div className="portfolio-visual">
                    <img
                      src="https://images.pexels.com/photos/28428591/pexels-photo-28428591.jpeg?auto=compress&amp;cs=tinysrgb&amp;w=1500"
                      alt="Blue geometric pattern"
                    />
                  </div>
                  <div className="portfolio-details">
                    <span className="portfolio-tag">
                      <span
                        dangerouslySetInnerHTML={{
                          __html: translate.raw('PortfolioTag_8zyCFm'),
                        }}
                      ></span>
                    </span>
                    <h3 className="portfolio-item-name">
                      <span
                        dangerouslySetInnerHTML={{
                          __html: translate.raw('PortfolioItemName_sFkT-K'),
                        }}
                      ></span>
                    </h3>
                    <p className="section-content">
                      <span
                        dangerouslySetInnerHTML={{
                          __html: translate.raw('SectionContent_KZX3TR'),
                        }}
                      ></span>
                    </p>
                    <a href="/vault/neon">
                      <div className="btn-link">
                        <span>
                          <span
                            dangerouslySetInnerHTML={{
                              __html: translate.raw('text_7xyWU7'),
                            }}
                          ></span>
                        </span>
                      </div>
                    </a>
                  </div>
                </div>
                <div className="portfolio-card">
                  <div className="portfolio-visual">
                    <img
                      src="https://images.pexels.com/photos/12272856/pexels-photo-12272856.jpeg?auto=compress&amp;cs=tinysrgb&amp;w=1500"
                      alt="Bronze sculptures faces"
                    />
                  </div>
                  <div className="portfolio-details">
                    <span className="portfolio-tag">
                      <span
                        dangerouslySetInnerHTML={{
                          __html: translate.raw('PortfolioTag_Bbu387'),
                        }}
                      ></span>
                    </span>
                    <h3 className="portfolio-item-name">
                      <span
                        dangerouslySetInnerHTML={{
                          __html: translate.raw('PortfolioItemName_Wg6L4C'),
                        }}
                      ></span>
                    </h3>
                    <p className="section-content">
                      <span
                        dangerouslySetInnerHTML={{
                          __html: translate.raw('SectionContent_tHtoNb'),
                        }}
                      ></span>
                    </p>
                    <a href="/vault/echoes">
                      <div className="btn-link">
                        <span>
                          <span
                            dangerouslySetInnerHTML={{
                              __html: translate.raw('text_g4zgP1'),
                            }}
                          ></span>
                        </span>
                      </div>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </section>
          <section className="swap-preview-section">
            <div className="swap-container">
              <div className="swap-card">
                <div className="swap-icon-group">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="48"
                    height="48"
                    viewBox="0 0 24 24"
                  >
                    <g
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                    >
                      <path d="M21 12a9 9 0 0 0-9-9a9.75 9.75 0 0 0-6.74 2.74L3 8"></path>
                      <path d="M3 3v5h5m-5 4a9 9 0 0 0 9 9a9.75 9.75 0 0 0 6.74-2.74L21 16"></path>
                      <path d="M16 16h5v5"></path>
                    </g>
                  </svg>
                </div>
                <h2 className="section-title">
                  <span
                    dangerouslySetInnerHTML={{
                      __html: translate.raw('SectionTitle_JIMaKC'),
                    }}
                  ></span>
                </h2>
                <p className="section-content">
                  <span
                    dangerouslySetInnerHTML={{
                      __html: translate.raw('SectionContent_jmp1EC'),
                    }}
                  ></span>
                </p>
                <div className="swap-examples">
                  <div className="swap-pill">
                    <span>
                      <span
                        dangerouslySetInnerHTML={{
                          __html: translate.raw('text_7jIxOk'),
                        }}
                      ></span>
                    </span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                    >
                      <path
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 12h14m-7-7l7 7l-7 7"
                      ></path>
                    </svg>
                    <span>
                      <span
                        dangerouslySetInnerHTML={{
                          __html: translate.raw('text_drEEhU'),
                        }}
                      ></span>
                    </span>
                  </div>
                  <div className="swap-pill">
                    <span>
                      <span
                        dangerouslySetInnerHTML={{
                          __html: translate.raw('text_h1ZH1A'),
                        }}
                      ></span>
                    </span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                    >
                      <path
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 12h14m-7-7l7 7l-7 7"
                      ></path>
                    </svg>
                    <span>
                      <span
                        dangerouslySetInnerHTML={{
                          __html: translate.raw('text_nuq_l5'),
                        }}
                      ></span>
                    </span>
                  </div>
                </div>
                <button className="btn btn-accent btn-lg">
                  <span
                    dangerouslySetInnerHTML={{
                      __html: translate.raw('Btn_3iwVuD'),
                    }}
                  ></span>
                </button>
              </div>
            </div>
          </section>
          <section className="about-section">
            <div className="about-container">
              <div className="about-content">
                <h2 className="section-title">
                  <span
                    dangerouslySetInnerHTML={{
                      __html: translate.raw('SectionTitle_yGcyZu'),
                    }}
                  ></span>
                </h2>
                <p className="section-content">
                  <span
                    dangerouslySetInnerHTML={{
                      __html: translate.raw('SectionContent_ORa1u7'),
                    }}
                  ></span>
                </p>
                <p className="section-content">
                  <span
                    dangerouslySetInnerHTML={{
                      __html: translate.raw('SectionContent_scPd5B'),
                    }}
                  ></span>
                </p>
                <div className="about-links">
                  <a href="/about">
                    <div className="btn btn-outline">
                      <span>
                        <span
                          dangerouslySetInnerHTML={{
                            __html: translate.raw('text_lIrlHD'),
                          }}
                        ></span>
                      </span>
                    </div>
                  </a>
                  <a href="/legal">
                    <div className="btn btn-link">
                      <span>
                        <span
                          dangerouslySetInnerHTML={{
                            __html: translate.raw('text_m_IV9S'),
                          }}
                        ></span>
                      </span>
                    </div>
                  </a>
                </div>
              </div>
              <div className="about-visual">
                <img
                  src="https://images.pexels.com/photos/15047884/pexels-photo-15047884.jpeg?auto=compress&amp;cs=tinysrgb&amp;w=1500"
                  alt="Art gallery interior"
                  className="about-img"
                />
              </div>
            </div>
          </section>
          <section className="testimonials-section">
            <div className="testimonials-header">
              <h2 className="section-title">
                <span
                  dangerouslySetInnerHTML={{
                    __html: translate.raw('SectionTitle_yOuooE'),
                  }}
                ></span>
              </h2>
              <p className="section-subtitle">
                <span
                  dangerouslySetInnerHTML={{
                    __html: translate.raw('SectionSubtitle_fRjncf'),
                  }}
                ></span>
              </p>
            </div>
            <div className="testimonials-rail">
              <div className="testimonial-card">
                <div className="testimonial-user">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="40"
                    height="40"
                    viewBox="0 0 24 24"
                  >
                    <g
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                    >
                      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                      <circle cx="12" cy="7" r="4"></circle>
                    </g>
                  </svg>
                  <div className="user-info">
                    <span className="user-name">
                      <span
                        dangerouslySetInnerHTML={{
                          __html: translate.raw('UserName_x6Oqcy'),
                        }}
                      ></span>
                    </span>
                    <span className="user-role">
                      <span
                        dangerouslySetInnerHTML={{
                          __html: translate.raw('UserRole_luBlbv'),
                        }}
                      ></span>
                    </span>
                  </div>
                </div>
                <p className="testimonial-text">
                  <span
                    dangerouslySetInnerHTML={{
                      __html: translate.raw('TestimonialText_exg9zP'),
                    }}
                  ></span>
                </p>
              </div>
              <div className="testimonial-card">
                <div className="testimonial-user">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="40"
                    height="40"
                    viewBox="0 0 24 24"
                  >
                    <g
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                    >
                      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                      <circle cx="12" cy="7" r="4"></circle>
                    </g>
                  </svg>
                  <div className="user-info">
                    <span className="user-name">
                      <span
                        dangerouslySetInnerHTML={{
                          __html: translate.raw('UserName_lN8iYD'),
                        }}
                      ></span>
                    </span>
                    <span className="user-role">
                      <span
                        dangerouslySetInnerHTML={{
                          __html: translate.raw('UserRole_RmkR4e'),
                        }}
                      ></span>
                    </span>
                  </div>
                </div>
                <p className="testimonial-text">
                  <span
                    dangerouslySetInnerHTML={{
                      __html: translate.raw('TestimonialText_G0c6aS'),
                    }}
                  ></span>
                </p>
              </div>
              <div className="testimonial-card">
                <div className="testimonial-user">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="40"
                    height="40"
                    viewBox="0 0 24 24"
                  >
                    <g
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                    >
                      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                      <circle cx="12" cy="7" r="4"></circle>
                    </g>
                  </svg>
                  <div className="user-info">
                    <span className="user-name">
                      <span
                        dangerouslySetInnerHTML={{
                          __html: translate.raw('UserName_RUroEq'),
                        }}
                      ></span>
                    </span>
                    <span className="user-role">
                      <span
                        dangerouslySetInnerHTML={{
                          __html: translate.raw('UserRole_XIgERH'),
                        }}
                      ></span>
                    </span>
                  </div>
                </div>
                <p className="testimonial-text">
                  <span
                    dangerouslySetInnerHTML={{
                      __html: translate.raw('TestimonialText_UvD-dK'),
                    }}
                  ></span>
                </p>
              </div>
              <div className="testimonial-card">
                <div className="testimonial-user">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="40"
                    height="40"
                    viewBox="0 0 24 24"
                  >
                    <g
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                    >
                      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                      <circle cx="12" cy="7" r="4"></circle>
                    </g>
                  </svg>
                  <div className="user-info">
                    <span className="user-name">
                      <span
                        dangerouslySetInnerHTML={{
                          __html: translate.raw('UserName_huQcS1'),
                        }}
                      ></span>
                    </span>
                    <span className="user-role">
                      <span
                        dangerouslySetInnerHTML={{
                          __html: translate.raw('UserRole_yeVdS_'),
                        }}
                      ></span>
                    </span>
                  </div>
                </div>
                <p className="testimonial-text">
                  <span
                    dangerouslySetInnerHTML={{
                      __html: translate.raw('TestimonialText_Y5ABO4'),
                    }}
                  ></span>
                </p>
              </div>
            </div>
          </section>
          <section className="final-cta-section">
            <div className="cta-container">
              <div className="cta-card">
                <h2 className="section-title">
                  <span
                    dangerouslySetInnerHTML={{
                      __html: translate.raw('SectionTitle_otUcr7'),
                    }}
                  ></span>
                </h2>
                <p className="section-content">
                  <span
                    dangerouslySetInnerHTML={{
                      __html: translate.raw('SectionContent_4igi0n'),
                    }}
                  ></span>
                </p>
                <div className="cta-buttons">
                  <button className="btn btn-primary btn-xl">
                    <span
                      dangerouslySetInnerHTML={{
                        __html: translate.raw('Btn_VAuVcg'),
                      }}
                    ></span>
                  </button>
                  <button className="btn btn-secondary btn-xl">
                    <span
                      dangerouslySetInnerHTML={{
                        __html: translate.raw('Btn_5mKbDr'),
                      }}
                    ></span>
                  </button>
                </div>
                <p className="cta-footer">
                  <span
                    dangerouslySetInnerHTML={{
                      __html: translate.raw('CtaFooter_ZsiS_h'),
                    }}
                  ></span>
                </p>
              </div>
            </div>
          </section>
        </main>
        <div className="home-container2">
          <div className="home-container3">
            <Script
              html={`<script defer data-name="facinations-interactions">
(function(){
  // Intersection Observer for reveal animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  }

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1"
        entry.target.style.transform = "translateY(0)"
        revealObserver.unobserve(entry.target)
      }
    })
  }, observerOptions)

  // Apply initial styles and observe elements
  document.querySelectorAll(".gallery-item, .portfolio-card, .testimonial-card").forEach((el) => {
    el.style.opacity = "0"
    el.style.transform = "translateY(30px)"
    el.style.transition = "all 0.6s ease-out"
    revealObserver.observe(el)
  })

  // Subtle Parallax for Hero
  window.addEventListener("scroll", () => {
    const scrolled = window.pageYOffset
    const heroVideo = document.querySelector(".hero-bg-video")
    if (heroVideo) {
      heroVideo.style.transform = \`translateY(\${scrolled * 0.3}px)\`
    }
  })

  // Testimonials Rail Auto-scroll hint
  const rail = document.querySelector(".testimonials-rail")
  if (rail) {
    let isDown = false
    let startX
    let scrollLeft

    rail.addEventListener("mousedown", (e) => {
      isDown = true
      rail.classList.add("active")
      startX = e.pageX - rail.offsetLeft
      scrollLeft = rail.scrollLeft
    })

    rail.addEventListener("mouseleave", () => {
      isDown = false
    })

    rail.addEventListener("mouseup", () => {
      isDown = false
    })

    rail.addEventListener("mousemove", (e) => {
      if (!isDown) return
      e.preventDefault()
      const x = e.pageX - rail.offsetLeft
      const walk = (x - startX) * 2
      rail.scrollLeft = scrollLeft - walk
    })
  }
})()
</script>`}
            ></Script>
          </div>
        </div>
        <Footer locale={props?.locale ?? ''}></Footer>
      </div>
      <style jsx>
        {`
          .home-container1 {
            width: 100%;
            display: block;
            min-height: 100vh;
          }
          .home-container2 {
            display: none;
          }
          .home-container3 {
            display: contents;
          }
        `}
      </style>
    </>
  )
}

export default Home

export async function getStaticProps(context) {
  const messages = (await import('/locales/' + context.locale + '.json'))
    .default
  return {
    props: {
      messages,
      ...context,
    },
  }
}
