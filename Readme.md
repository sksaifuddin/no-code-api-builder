“NO Code API builder” is a tool which allows you to create REST APIs without writing code. Users will create tables to store the data and REST API end points to get, insert, update, delete the data of those tables will be dynamically generated. Users can directly use those API end points in their front-end applications. 

It’s a tool for developers to create APIs faster without even writing code and only concentrates on the frontend of the application. It can be useful for creating rapid prototypes of applications (POCs) to show customers. Currently, it’s developed by assuming that it will be developed for an organization and not public, so it does not have user registration feature. The tool is built fully on AWS cloud and uses serverless Lambda function to execute dynamically generated APIs.

## Demo

https://youtu.be/09onZ9HlFMM

## Services used

1. **AWS EC2** - To deploy frontend and backend code.
2. **AWS Lambda** - To execute queries of dynamically generated REST APIs. 
3. **AWS RDS** - To store all the data and tables of the users.
4. **AWS API Gateway** - To generate dynamically REST API URLs.
5. **AWS Secrets Manager** - To store RDS user, password and host
6. **AWS SNS** - To send email to user with JWT token

## Architecture

![Architecture](https://github.com/sksaifuddin/advance-cloud-dalhousie-university/blob/main/term-assignment/images/term-assignment-architecture.png)



## Deployment Model
The cloud deployment model used for this application is “Public cloud”. The whole infrastructure of the application is built using AWS which is third party owned cloud, we just provisioned all the infrastructure needed, hence this comes under “Public Cloud”.
Public cloud platforms offer a wide range of managed services. These services handle various aspects of the infrastructure, such as serverless computing (e.g., AWS Lambda), managed databases (e.g., AWS RDS), and API management (e.g., AWS API Gateway). By leveraging these managed services, the development team can focus on building the tool's core features instead of managing infrastructure. The APIs which are generated in the application need to be easily accessible over the internet, public cloud has the lowest difficulty to get the application public. The resources API gateway and Lambda are critical to the application. Currently the best way to use these services is to use public cloud, especially AWS as they have the best serverless offerings with lowest cost.

## Delivery Model
The delivery model of my application is “Backend as a service” (BaaS), which is a specialized form of “Platform as a Service” (PaaS) but for backend services. 
Backend as a Service automates backend development. It provides an abstraction over the Platform as a Service like RDS and gives user a “ready-to-use” environment where all the configured IT resources are already deployed and allows user to focus on providing backend infrastructure and services, allowing developers to focus on building the frontend and business logic of their applications without worrying about backend complexities. The user needs to just take care of the data and table structure of the applications and the REST APIs will be generated without even writing a single piece of code.
Using BaaS also provided automated scaling as the API queries execution happens on serverless technologies. BaaS significantly accelerates the development process by eliminating the need to set up and manage backend infrastructure. It allows developers to quickly deploy new features and updates to the tool. 
