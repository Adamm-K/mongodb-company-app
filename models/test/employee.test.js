const Employee = require('../employee.model.js');
const expect = require('chai').expect;
const mongoose = require('mongoose');
const e = require('cors');

describe('Employee', () => {
  it('should throw an error if there is no arguments', () => {
    const emp = new Employee({});
    emp.validate((err) => {
      expect(err.errors).to.exist;
    });
  });
  it('should throw an error if arguments are not a string', () => {
    const cases = [{}, []];
    for (let employee of cases) {
      const emp = new Employee({
        firstName: employee,
        lastName: employee,
        department: employee,
      });
      emp.validate((err) => {
        expect(err.errors).to.exist;
      });
    }
  });
  it('should throw an error if arguments does not contain firstName, lastName and department', () => {
    const cases = [
      {
        firstName: 'John',
      },
      {
        lastName: 'Doe',
      },
      {
        department: 'Human Resources',
      },
      {
        firstName: 'John',
        lastName: 'Doe',
      },
      {
        firstName: 'John',
        department: 'Human Resources',
      },
    ];
    for (let employee of cases) {
      const emp = new Employee(employee);

      emp.validate((err) => {
        expect(err.errors).to.exist;
      });
    }
  });
  it('should not throw an error if arguments are correct', () => {
    const emp = new Employee({
      firstName: 'John',
      lastName: 'Doe',
      department: 'Human Resources',
    });
    emp.validate((err) => {
      expect(err).to.not.exist;
    });
  });
});