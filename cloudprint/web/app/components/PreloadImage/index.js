import React from 'react';
import loadImageAsync from 'utils/loadImageAsync';
import makeCancelable from 'utils/makeCancelable';

const checkValidSrc = src => {
  if (typeof src === 'string' && src.trim() !== '') {
    return true;
  }
  return false;
};

const withPreloadImage = (WrappedImageComponent, errorSrc) => {
  class PreloadImage extends React.PureComponent {
    initState = {
      isFetching: false,
      src: false,
    };

    unsubscribes = [];

    state = this.initState;

    receive = src => {
      this.setState({
        isFetching: false,
        src,
      });
    };

    request = () => {
      const { src } = this.props;

      this.setState({
        isFetching: true,
        src: false,
      });

      if (checkValidSrc(src) === false) return;
      const { promise, cancel } = makeCancelable(loadImageAsync(src));
      this.unsubscribes.push(cancel);
      promise
        .then(() => {
          this.receive(src);
        })
        .catch(e => {
          const { isCanceled } = e || {};
          if (isCanceled) return;

          this.insteadErrorImg();
        });
    };

    insteadErrorImg = () => {
      const { promise, cancel } = makeCancelable(loadImageAsync(errorSrc));
      this.unsubscribes.push(cancel);
      promise
        .then(() => {
          this.receive(errorSrc);
        })
        .catch(e => {
          const { isCanceled } = e || {};
          if (isCanceled) return;
          this.setState({
            isFetching: false,
          });
        });
    };

    componentDidMount() {
      this.request();
    }

    componentWillUnmount() {
      this.unsubscribes.forEach(unsubscribe => unsubscribe());
    }

    componentDidUpdate(previousProps) {
      // compare props
      const { error, src } = this.props;

      if (error) {
        this.insteadErrorImg();
        return; // break
      }

      if (previousProps.src !== src) {
        this.request();
      }
    }

    render() {
      // state overwrite props
      return <WrappedImageComponent {...this.props} {...this.state} />;
    }
  }

  return PreloadImage;
};

export default withPreloadImage;
