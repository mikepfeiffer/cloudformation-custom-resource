# CloudFormation Custom Resource Example

This is a sample CloudFormation template that uses an AWS Lambda function as a custom resource. The Lambda retrieves the most recent HVM-based Amazon Linux or Windows 2012 R2 AMI ID based on the desired OS type assigned via input parameter. This was adapted from [this example](http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/walkthrough-custom-resources-lambda-lookup-amiids.html) from the CloudFormation documentation.

Use the following steps to launch the template.

1. Create an S3 bucket in the region where you want to launch the stack.
2. Add the amilookup.js file in this repo to a zip archive
3. Upload the zip archive to your new S3 bucket
4. Launch Custom-Resource-Example.template and assign your bucket name to the S3Bucket parameter. Make sure the S3Key parameter references the correct zip archive file name (amilookup.zip by default).

![alt text](https://cloud.githubusercontent.com/assets/5126491/18691648/c7378ad4-7f49-11e6-851c-b3c5a7717825.gif "README Image")

Note: You can use the OSType parameter to set the operating system. By default, it is set to Amazon Linux, but also supports Windows Server 2012 R2.
