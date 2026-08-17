import type { Film } from './types'

/**
 * The film archive — 21 films, migrated verbatim from the source site's Film & motion rail.
 *
 * Two entries (BMW Golf Cup 2021, Mahindra Electric) are listed on the source site
 * without a playable link. They are kept in the archive and rendered as
 * non-playable until a URL is supplied, rather than dropped or linked to something else.
 *
 * `year` is only set where the source title itself states one. It is not inferred.
 */
export const films: Film[] = [
  { id: 'bmw-golf-cup-2021', title: 'BMW Golf Cup 2021', client: 'BMW', category: 'Event coverage', youtubeId: null, externalUrl: null, year: '2021' },
  { id: 'joyfest-pune', title: 'Joyfest Pune', client: 'BMW Bavaria Motors', category: 'Event coverage', youtubeId: 'lx46tf2CF2o', externalUrl: null, year: null },
  { id: 'endurance-ride-2019', title: 'Endurance Ride 2019', client: 'BMW Motorrad', category: 'Customer experience', youtubeId: 'R-kKb_V0kd0', externalUrl: null, year: '2019' },
  { id: 'endurance-ride-2018', title: 'Endurance Ride 2018', client: 'BMW Motorrad', category: 'Customer experience', youtubeId: 'JPoAaFO-N60', externalUrl: null, year: '2018' },
  { id: 'rishabh-gulshan', title: 'Rishabh Gulshan', client: 'BMW Motorrad', category: 'Customer experience', youtubeId: 'JmSvoKlW_Ec', externalUrl: null, year: null },
  { id: 'golf-course-road-showroom', title: 'Golf Course Road showroom', client: 'BMW Bird Automotive', category: 'New showroom launch', youtubeId: 'Hg_T613lfj8', externalUrl: null, year: null },
  { id: 'progress-has-a-new-pincode', title: 'Progress has a New Pincode', client: 'Audi Gurugram', category: 'New showroom launch', youtubeId: 'DHmq1kqdnjE', externalUrl: null, year: null },
  { id: 'mahindra-electric', title: 'Mahindra Electric', client: 'Mahindra', category: 'Ad film', youtubeId: null, externalUrl: null, year: null },
  { id: 'a-broad-overview', title: 'A Broad Overview', client: 'Shipyaari', category: 'Brand video', youtubeId: 'DcP2TbGxYXc', externalUrl: null, year: null },
  { id: 'from-the-ground-up', title: 'From the Ground Up', client: 'Skyways', category: 'Memoir', youtubeId: 'i_AreLMwkKE', externalUrl: null, year: null },
  { id: 'cyber-hub-relaunch', title: 'Cyber Hub relaunch', client: 'DLF', category: 'Brand relaunch', youtubeId: 'z5VsAOcCss4', externalUrl: null, year: null },
  { id: 'how-to-choose-the-right-gold', title: 'How to Choose the Right Gold', client: 'CaratLane', category: 'Brand video', youtubeId: '-XbZvRf1_rU', externalUrl: null, year: null },
  { id: 'traditional-modern-mangalsutra', title: 'Traditional & Modern Mangalsutra', client: 'CaratLane', category: 'Brand video', youtubeId: 'M5l9HHKESu4', externalUrl: null, year: null },
  { id: 'stop-killing-yourself', title: 'Stop Killing Yourself', client: null, category: 'Public interest film', youtubeId: 'MGxI-tGjvcs', externalUrl: null, year: null },
  { id: 'welspun-csr-film', title: 'Welspun CSR Film', client: 'Welspun', category: 'CSR film', youtubeId: 'AKDJNgjl60M', externalUrl: null, year: null },
  { id: 'moti-jewels-palace', title: 'The Story of Moti Jewels Palace', client: 'Moti Jewels Palace', category: 'Brand film', youtubeId: 'kN3A_yBVp08', externalUrl: null, year: null },
  { id: 'all-surface-cleaner', title: 'All Surface Cleaner', client: 'Exo Disinfectant', category: 'Ad film', youtubeId: 'PdZJyEKE2z8', externalUrl: null, year: null },
  { id: 'pril-tamarind', title: 'Pril Tamarind', client: 'Pril', category: 'Ad film', youtubeId: 'FQ3jswbRxOI', externalUrl: null, year: null },
  { id: 'irecomm-brand-video', title: 'iRecomm Brand Video', client: 'iRecomm', category: 'Brand video', youtubeId: 'isL_KDbseNA', externalUrl: null, year: null },
  // Client left null: the copy deck marks this one "[attribution to confirm]", and the
  // hosting page alone is not enough to publish a brand credit against it.
  { id: 'phantom-express', title: 'Phantom Express', client: null, category: 'Motion graphics', youtubeId: null, externalUrl: 'https://www.facebook.com/skywayslogisticsgroup/videos/505410466910701/', year: null },
  { id: 'inky-inkclick-mascot', title: 'Inky, the Inkclick mascot', client: 'Inkclick', category: '3D motion graphics', youtubeId: 'sVBWA0luE1c', externalUrl: null, year: null },
]

export const filmCategories = [...new Set(films.map((f) => f.category))].sort()
export const filmClients = [...new Set(films.map((f) => f.client).filter((c): c is string => Boolean(c)))].sort()
export const filmYears = [...new Set(films.map((f) => f.year).filter((y): y is string => Boolean(y)))].sort().reverse()

/** YouTube's own poster frame. No local asset exists for any film. */
export const filmPoster = (f: Film) =>
  f.youtubeId ? `https://img.youtube.com/vi/${f.youtubeId}/hqdefault.jpg` : null

export const filmWatchUrl = (f: Film) =>
  f.youtubeId ? `https://www.youtube.com/watch?v=${f.youtubeId}` : f.externalUrl
