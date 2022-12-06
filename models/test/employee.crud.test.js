const Employee = require('../employee.model.js');
const expect = require('chai').expect;
const mongoose = require('mongoose');

describe('Employee', () => {
  before(async () => {
    try {
      await mongoose.connect('mongodb://localhost:27017/companyDBtest', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
    } catch (err) {
      console.error(err);
    }
  });

  describe('Reading data', () => {
    before(async () => {
      const testEmpOne = new Employee({
        firstName: 'John',
        lastName: 'Doe',
        department: 'HR',
      });
      await testEmpOne.save();

      const testEmpTwo = new Employee({
        firstName: 'Amanda',
        lastName: 'Doe',
        department: 'IT',
      });
      await testEmpTwo.save();
    });
    it('should return all data with "find" method', async () => {
      const employees = await Employee.find();
      const expectedLength = 2;
      expect(employees.length).to.be.equal(expectedLength);
    });
    it('should return proper document by various params with findOne method', async () => {
      const employee = await Employee.findOne({
        firstName: 'John',
        lastName: 'Doe',
        department: 'HR',
      });
      const expectedFirstName = 'John';
      expect(employee.firstName).to.be.equal(expectedFirstName);
    });
    after(async () => {
      await Employee.deleteMany();
    });
  });
  describe('Creating data', () => {
    it('should insert new document with "insertOne" method', async () => {
      const employee = new Employee({
        firstName: 'John',
        lastName: 'Doe',
        department: 'HR',
      });
      await employee.save();
      expect(employee.isNew).to.be.false;
    });
    after(async () => {
      await Employee.deleteMany();
    });
  });
  describe('Updating data', () => {
    before(async () => {
      const testEmpOne = new Employee({
        firstName: 'John',
        lastName: 'Doe',
        department: 'HR',
      });
      await testEmpOne.save();

      const testEmpTwo = new Employee({
        firstName: 'Amanda',
        lastName: 'Doe',
        department: 'IT',
      });
      await testEmpTwo.save();
    });
    it('should properly update one document with "updateOne" method', async () => {
      await Employee.updateOne(
        { firstName: 'John' },
        { $set: { firstName: 'Tom' } }
      );
      const updatedEmployee = await Employee.findOne({ firstName: 'Tom' });
      expect(updatedEmployee).to.not.be.null;
    });
    it('should properly update one document with "save" method', async () => {
      const employee = await Employee.findOne({ firstName: 'Amanda' });
      employee.firstName = 'Emma';
      await employee.save();

      const updatedEmployee = await Employee.findOne({ firstName: 'Emma' });
      expect(updatedEmployee).to.not.be.null;
    });
    it('should properly update multiple documents with "updateMany" method', async () => {
      await Employee.updateMany({}, { $set: { firstName: 'Updated!' } });
      const employees = await Employee.find();
      expect(employees[0].firstName).to.be.equal('Updated!');
      expect(employees[1].firstName).to.be.equal('Updated!');
    });
    after(async () => {
      await Employee.deleteMany();
    });
  });
  describe('Removing data', () => {
    beforeEach(async () => {
      const testEmpOne = new Employee({
        firstName: 'John',
        lastName: 'Doe',
        department: 'HR',
      });
      await testEmpOne.save();

      const testEmpTwo = new Employee({
        firstName: 'Amanda',
        lastName: 'Doe',
        department: 'IT',
      });
      await testEmpTwo.save();
    });

    it('should properly remove one document with "deleteOne" method', async () => {
      await Employee.deleteOne({ firstName: 'John' });
      const removeEmployee = await Employee.findOne({ firstName: 'John' });
      expect(removeEmployee).to.be.null;
    });

    it('should properly remove one document with remove method', async () => {
      const employee = await Employee.findOne({
        firstName: 'Amanda',
        lastName: 'Doe',
        department: 'IT',
      });
      await employee.remove();

      const removedEmployee = await Employee.findOne({
        firstName: 'Amanda',
        lastName: 'Doe',
        department: 'IT',
      });
      expect(removedEmployee).to.be.null;
    });

    it('should properly remove multiple documents with "deleteMany" method', async () => {
      await Employee.deleteMany({});
      const employees = await Employee.find();
      expect(employees.length).to.be.equal(0);
    });

    afterEach(async () => {
      await Employee.deleteMany();
    });
  });
});