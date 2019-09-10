import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import Momnet from 'react-moment';

const ProfileExperiece = ({
  experience: { company, title, location, current, to, from, description }
}) => {
  return (
    <Fragment>
      <h3 className='text-dark'>{company}</h3>
      <p>
        <Momnet format='YYYY/MM/DD'>{from}</Momnet> -
        {!to ? 'Now' : <Momnet format='YYYY/MM/DD'>{to}</Momnet>}
      </p>
      <p>
        <strong>Position:</strong> {title}
      </p>
      <p>
        <strong>Description:</strong> {description}
      </p>
    </Fragment>
  );
};

ProfileExperiece.propTypes = {
  experience: PropTypes.array.isRequired
};

export default ProfileExperiece;
