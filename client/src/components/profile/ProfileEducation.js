import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import Momnet from 'react-moment';

const ProfileEducation = ({
  education: { school, degree, fieldofstudy, current, to, from, description }
}) => {
  return (
    <Fragment>
      <h3 className='text-dark'>{school}</h3>
      <p>
        <Momnet format='YYYY/MM/DD'>{from}</Momnet> -
        {!to ? 'Now' : <Momnet format='YYYY/MM/DD'>{to}</Momnet>}
      </p>
      <p>
        <strong>Degree:</strong> {degree}
      </p>
      <p>
        <strong>Field Of Study:</strong> {fieldofstudy}
      </p>
    </Fragment>
  );
};

ProfileEducation.propTypes = {
  education: PropTypes.array.isRequired
};

export default ProfileEducation;
