# Configuración AWS - S3 + CloudFront

## IAM Role

El backend utiliza el siguiente IAM Role para acceder a S3:
- **ARN**: `arn:aws:iam::565493866589:role/EC2-RogenBackend-InstanceProfile`

Este role debe estar asignado a la instancia EC2 donde corre el backend.

## Permisos Requeridos

El IAM Role debe tener los siguientes permisos en una política IAM:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:PutObject",
        "s3:PutObjectAcl",
        "s3:GetObject",
        "s3:DeleteObject"
      ],
      "Resource": "arn:aws:s3:::rogen-autos-data/autos/*"
    },
    {
      "Effect": "Allow",
      "Action": [
        "s3:ListBucket"
      ],
      "Resource": "arn:aws:s3:::rogen-autos-data",
      "Condition": {
        "StringLike": {
          "s3:prefix": "autos/*"
        }
      }
    }
  ]
}
```

## Configuración S3

- **Bucket**: `rogen-autos-data`
- **Carpeta**: `autos/`
- **Región**: `us-east-1`
- **ACL**: `public-read` (para que CloudFront pueda servir las imágenes)

## Configuración CloudFront

- **Dominio**: `https://media.rogen-autos.com`
- **Origen**: `rogen-autos-data.s3.us-east-1.amazonaws.com`
- **Path Pattern**: `/autos/*`
- **Comportamiento**: Configurado para servir desde el bucket S3

## Verificación

Para verificar que el IAM Role tiene los permisos correctos, puedes ejecutar desde la instancia EC2:

```bash
# Verificar que el role está asignado
curl http://169.254.169.254/latest/meta-data/iam/security-credentials/

# Verificar las credenciales temporales
aws sts get-caller-identity

# Probar acceso a S3
aws s3 ls s3://rogen-autos-data/autos/
```

## Notas

- El código NO requiere access keys en variables de entorno
- El SDK de AWS detecta automáticamente las credenciales del IAM Role
- Las imágenes se almacenan como paths de S3 en la base de datos
- Las URLs se transforman automáticamente a CloudFront al leer desde la API
