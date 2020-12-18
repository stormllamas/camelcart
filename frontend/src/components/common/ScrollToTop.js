import { useEffect } from 'react';
import { withRouter } from 'react-router-dom';

function ScrollToTop({ history }) {
  useEffect(() => {
    const unlisten = history.listen(() => {
      if (!history.location.pathname.includes('/food/restaurant')) {
        window.scrollTo(0, 0);
      } else if (history.location.search.includes('&course=Meals')) {
        window.scrollTo(0, 0);
      } else if (history.location.pathname.includes('/food/restaurant/product')) {
        window.scrollTo(0, 0);
      }
    });
    return () => {
      unlisten();
    }
  }, []);

  return (null);
}

export default withRouter(ScrollToTop);