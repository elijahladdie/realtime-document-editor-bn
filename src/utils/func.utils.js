const requiredEnvVariables = [
    'MONGO_URI',    
    'PORT',         
    'SECRET_KEY',   
  ];
  
export const validateEnvVariables = () => {
    const missingEnvVars = requiredEnvVariables.filter((envVar) => {
      return !process.env[envVar];
    });
  
    if (missingEnvVars.length > 0) {
      console.error(`Error: Missing the following environment variables: ${missingEnvVars.join(', ')}`);
      process.exit(1); 
    }
  
    console.log('All required environment variables are set.');
  }
  

  export const mergeContent = (existingContent, newContent) => {
    return existingContent + '\n' + newContent;
}
