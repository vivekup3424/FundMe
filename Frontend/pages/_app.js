import '../styles/globals.css'
import instance from '../ethereum/factory';
export default function App({ Component, pageProps }) {
  return <Component {...pageProps} />
}
