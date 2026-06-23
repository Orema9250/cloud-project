# Dockerized 3-Tier Web Application Deployment on AWS ECS Fargate using Cloudformation 

## Project Overview

This project demonstrates the deployment of a containerized 3-tier web application on AWS using Amazon ECS Fargate. The application follows modern DevOps practices including containerization, infrastructure automation, load balancing, and continuous deployment using GitHub Actions.

The solution eliminates server management by leveraging AWS Fargate while enabling automated rolling deployments through a CI/CD pipeline.

---

## Architecture

### Components

#### Frontend Tier

* Static web application
* Deployed on Amazon ECS Fagarte

#### Application Tier

* Backend API containerized with Docker
* Deployed on Amazon ECS Fargate
* Exposed through an Application Load Balancer (ALB)

#### Data Tier

* Database layer PostgreSQL
* Isolated from public internet access

---

## Architecture Diagram

```text
┌─────────────────────────────────────────────────────┐
│                        AWS VPC                      │
│                                                     │
│  ┌─────────────────────────────────────────────┐    │
│  │         Application Load Balancer           │    │
│  └─────────────────────────────────────────────┘    │
│                    │                                │
│         ┌──────────┴──────────┐                     │
│         │                     │                     │
│         ▼                     ▼                     │
│ ┌───────────────┐   ┌────────────────┐              │
│ │ Frontend ECS  │   │  Backend ECS   │              │
│ │   Service     │   │    Service     │              │
│ │   Fargate     │   │    Fargate     │              │
│ └───────────────┘   └────────────────┘              │
│                                │                    │
│                                ▼                    │
│                       ┌────────────────┐            │
│                       │    Database    │            │
│                       └────────────────┘            │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

## Technologies Used

### Cloud

* AWS ECS Fargate
* Amazon ECR
* Application Load Balancer
* IAM
* VPC
* Security Groups

### DevOps

* Docker
* GitHub Actions
* CI/CD Pipeline

### Application

* Frontend: Vite/JavaScript/Docker
* Backend: Node.js/Express.js/Docker
* Database: PostgreSQL

---

## Containerization

The backend application is packaged into a Docker image and stored in Amazon Elastic Container Registry (ECR).

### Docker Workflow

```bash
docker build -t backend .
docker tag backend:latest <ecr-repository-uri>
docker push <ecr-repository-uri>
```

---

## CI/CD Pipeline

The project uses GitHub Actions to automate deployments.

### Pipeline Flow

1. Developer pushes code to GitHub.
2. GitHub Actions workflow starts.
3. Docker image is built.
4. Image is pushed to Amazon ECR.
5. ECS task definition is updated.
6. ECS service performs a rolling deployment.
7. New containers become healthy.
8. Old containers are terminated.

### Deployment Strategy

* Rolling Deployment
* Zero-downtime updates
* Automatic service stabilization
* Health checks through ALB

---

## GitHub Actions Workflow

### Workflow Features

* Automated Docker image build
* ECR authentication
* Image push to ECR
* ECS task definition rendering
* ECS rolling deployment
* Service stability validation

---

## AWS Services Used

| Service        | Purpose                  |
| -------------- | ------------------------ |
| ECS Fargate    | Container orchestration  |
| ECR            | Container registry       |
| ALB            | Traffic distribution     |
| IAM            | Security and permissions |
| GitHub Actions | CI/CD automation         |

---

## Security Considerations

* IAM least privilege access
* Private ECS networking
* Environment variables managed securely
* HTTPS enabled through ALB
* Container images stored in private ECR repositories

---

## Deployment Steps

### Clone Repository

```bash
git clone https://github.com/Orema9250/cloud-project.git
cd project-name
```

### Build Docker Image

```bash
docker build -t backend .
```

### Push to ECR

```bash
docker tag backend:latest <ecr-uri>
docker push <ecr-uri>
```

### Deploy

Deployment is automated through GitHub Actions when code is pushed to the main branch.

```bash
git add .
git commit -m "new feature"
git push origin main
```
##Challenges Encountered and Resolutions

1. CloudFormation Schema Validation Errors

* Issue:
While creating ECS task definitions through CloudFormation, deployment failed due to schema validation errors involving:

- Environment variables (Environment)
- Secrets configuration (Secrets)
- Log configuration (LogConfiguration)

* Resolution:
Reviewed the AWS CloudFormation resource specifications and corrected the YAML structure to match the required ECS Task Definition schema.

2. ECS Service Creation Before ALB Listener Availability

* Issue:
The ECS service attempted to register with the target group before the Application Load Balancer listener was fully created, causing stack deployment failures.

* Resolution:
Added a DependsOn attribute to the ECS Service resource, ensuring the ALB Listener was created before ECS service deployment.

BackendECSService:
  Type: AWS::ECS::Service
  DependsOn:
    - ALBListener

3. Security Group Reference Issues

* Issue:
Incorrect security group associations prevented communication between:

- Application Load Balancer
- ECS Tasks
- Backend services

* Resolution:
Reviewed inbound and outbound rules and implemented proper security group referencing to allow only the required traffic flow between AWS resources.

4. IAM Trust Policy Misconfigurations

* Issue:
ECS tasks were unable to assume their IAM roles due to incorrect trust relationships.

* Resolution:
Updated IAM trust policies to allow the ECS Tasks service principal to assume the required roles.

Example:

{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Service": "ecs-tasks.amazonaws.com"
      },
      "Action": "sts:AssumeRole"
    }
  ]
}

5. Application Load Balancer and Target Group Wiring Issues

* Issue:
Traffic was not reaching ECS tasks due to misconfigured relationships between:

- ALB Listener
- Listener Rules
- Target Groups
- ECS Service

* Resolution:
Correctly associated the ECS service with the target group and verified listener forwarding rules, target registration, and health check configurations.

Key Lessons Learned

Through this project, I gained hands-on experience troubleshooting:

* AWS ECS Fargate deployments
* CloudFormation dependency management
* IAM roles and trust policies
* Security group architecture
* ALB and Target Group integrations
* Containerized application networking
* Infrastructure-as-Code debugging

This troubleshooting process significantly improved my understanding of AWS infrastructure design and production deployment workflows.

---

## Key DevOps Concepts Demonstrated

* Docker Containerization
* AWS ECS Fargate
* Continuous Integration
* Continuous Deployment
* Infrastructure Automation
* Application Load Balancing
* Rolling Deployments
* Cloud Architecture Design
* Container Registry Management

---

## Future Improvements

* Infrastructure as Code using Terraform
* Host frontend in S3
* Distribute content globally using CloudFront
* Blue/Green Deployments
* ECS Auto Scaling
* Centralized Logging
* Kubernetes Migration
* DevSecOps Security Scanning

---

## Author

Oreoluwa Salami

Aspiring Cloud & DevOps Engineer focused on AWS, Docker, ECS, CI/CD, Terraform, Kubernetes, and Cloud Automation.

