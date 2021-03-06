import React from 'react';
import { Formik } from 'formik';
import { wait, render, fireEvent } from '@testing-library/react';
import OperationCodeAPIMock from 'test-utils/mocks/apiMock';
import createSnapshotTest from 'test-utils/createSnapshotTest';
import Form from 'components/Form/Form';

import MilitaryDetails from '../MilitaryDetails';

describe('UpdateProfileForm/Steps/MilitaryDetails', () => {
  afterEach(() => {
    OperationCodeAPIMock.reset();
  });

  it('should render in context of Formik', () => {
    createSnapshotTest(
      <Formik
        initialValues={MilitaryDetails.initialValues}
        validationSchema={MilitaryDetails.validationSchema}
      >
        <Form>
          <MilitaryDetails />
        </Form>
      </Formik>,
    );
  });

  it('should update user on submit', async () => {
    OperationCodeAPIMock.onPatch('auth/profile/').reply(200);

    const { container } = render(
      <Formik
        initialValues={MilitaryDetails.initialValues}
        validationSchema={MilitaryDetails.validationSchema}
        onSubmit={MilitaryDetails.submitHandler}
      >
        <Form>
          <MilitaryDetails />
        </Form>
      </Formik>,
    );

    const ReactSelect = container.querySelector('#react-select-branchOfService-input');

    fireEvent.blur(ReactSelect);
    fireEvent.keyDown(ReactSelect, { key: 'ArrowDown', keyCode: 40 });
    fireEvent.keyDown(ReactSelect, { key: 'ArrowDown', keyCode: 40 });

    fireEvent.keyDown(ReactSelect, { key: 'Enter', keyCode: 13 });

    fireEvent.change(container.querySelector('input#yearsOfService'), {
      target: { id: 'yearsOfService', value: '3' },
    });

    fireEvent.change(container.querySelector('input#payGrade'), {
      target: { id: 'payGrade', value: 'E-5' },
    });

    fireEvent.submit(container.querySelector('form'));
    await wait(() => {
      expect(OperationCodeAPIMock.history.patch.length).toStrictEqual(1);
    });
  });
});
