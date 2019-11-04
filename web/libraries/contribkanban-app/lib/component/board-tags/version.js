import React from 'react';
import {string} from 'prop-types';

const IssueVersion = ({ version }) => version !== null ? <span className="tag bg-success">{version}</span> : null;
IssueVersion.propTypes = {
  version: string.isRequired
};
export default IssueVersion;
