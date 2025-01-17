import { CognitoIdentityProviderClient, AdminConfirmSignUpCommand, AdminAddUserToGroupCommand  } from "@aws-sdk/client-cognito-identity-provider";

// Configuração da região da AWS
export const cognitoClient = new CognitoIdentityProviderClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export const confirmUser = async (username: string, userPoolId: string): Promise<void> => {
  const params = {
    UserPoolId: userPoolId,
    Username: username,
  };

  try {
    const command = new AdminConfirmSignUpCommand(params);
    await cognitoClient.send(command);
    console.log(`Usuário ${username} confirmado com sucesso.`);
  } catch (error: any) {
    console.error("Erro ao confirmar usuário no Cognito:", error.message);
    throw new Error(`Erro ao confirmar usuário: ${error.message}`);
  }
};

export const addUserToGroup = async (
    username: string,
    userPoolId: string,
    groupName: string
  ): Promise<void> => {
    const params = {
      GroupName: groupName,
      UserPoolId: userPoolId,
      Username: username,
    };
  
    try {
      const command = new AdminAddUserToGroupCommand(params);
      await cognitoClient.send(command);
      console.log(`Usuário ${username} adicionado ao grupo ${groupName} com sucesso.`);
    } catch (error: any) {
      console.error("Erro ao adicionar usuário ao grupo:", error.message);
      throw new Error(`Erro ao adicionar usuário ao grupo: ${error.message}`);
    }
  };
