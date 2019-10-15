import React from 'react';
import { Alert } from 'reactstrap';

export default function Error(props) {
  return props.error ? <Alert color="danger">{props.error}</Alert> : '';
}
