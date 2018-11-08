import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { makeSelectForm } from './selectors/form';

const FormCheck = () => null;

FormCheck.propTypes = {
  form: PropTypes.shape({
    taskSource: PropTypes.string.isRequired,
    printerSn: PropTypes.string.isRequired,
    printDirection: PropTypes.number.isRequired,
    printStartPage: PropTypes.number.isRequired,
    printEndPage: PropTypes.number.isRequired,
    paperSize: PropTypes.string.isRequired,
    printColorMode: PropTypes.string.isRequired,
    printWhole: PropTypes.number.isRequired,
    duplexMode: PropTypes.number.isRequired,
    copyCount: PropTypes.number.isRequired,
    printDpi: PropTypes.number.isRequired,
    fileList: PropTypes.shape({
      fileSource: PropTypes.string.isRequired,
      fileName: PropTypes.string.isRequired,
      fileSuffix: PropTypes.string.isRequired,
      printPDF: PropTypes.bool.isRequired,
      printUrl: PropTypes.string.isRequired,
      printMd5: PropTypes.string.isRequired,
      totalPage: PropTypes.number.isRequired,
      fileId: PropTypes.string.isRequired,
    }),
  }),
};

const mapStateToProps = createStructuredSelector({
  form: makeSelectForm(),
});

export default connect(mapStateToProps)(FormCheck);
