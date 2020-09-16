import React, {
  useCallback,
} from 'react';
import {
  fieldToTextField,
} from 'formik-material-ui';
import {
  TextField,
} from '@material-ui/core';

const LowerCaseTextField = (props) => {
  const {
    form: {setFieldValue},
    field: {name},
  } = props;
  const onChange = useCallback(
    (event) => {
      const {value} = event.target;
      setFieldValue(name, value ? value.toLowerCase() : '');
    },
    [setFieldValue, name]
  );
  return <TextField {...fieldToTextField(props)} onChange={onChange} />;
}

export default LowerCaseTextField;
