import os

from pathlib import Path
from datetime import timedelta
from decouple import config

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve(strict=True).parent.parent


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/3.1/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = config('SECRET_KEY')

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

ALLOWED_HOSTS = []


# Application definition

INSTALLED_APPS = [
  'django.contrib.admin',
  'django.contrib.auth',
  'django.contrib.contenttypes',
  'django.contrib.sessions',
  'django.contrib.messages',
  'django.contrib.staticfiles',
  'rest_framework',
  'knox',

  'frontend',
  'logistics',
  'accounts',
  'configuration',
  'manager'
]

MIDDLEWARE = [
  'django.middleware.security.SecurityMiddleware',
  'django.contrib.sessions.middleware.SessionMiddleware',
  'django.middleware.common.CommonMiddleware',
  'django.middleware.csrf.CsrfViewMiddleware',
  'django.contrib.auth.middleware.AuthenticationMiddleware',
  'django.contrib.messages.middleware.MessageMiddleware',
  'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'camelcart.urls'

TEMPLATES = [
  {
    'BACKEND': 'django.template.backends.django.DjangoTemplates',
    'DIRS': [os.path.join(BASE_DIR, 'templates'), os.path.join(BASE_DIR, 'templatetags')],
    'APP_DIRS': True,
    'OPTIONS': {
      'context_processors': [
        'django.template.context_processors.debug',
        'django.template.context_processors.request',
        'django.contrib.auth.context_processors.auth',
        'django.contrib.messages.context_processors.messages',
      ],
    },
  },
]

WSGI_APPLICATION = 'camelcart.wsgi.application'


# Database
# https://docs.djangoproject.com/en/3.1/ref/settings/#databases

DATABASES = {
  'default': {
    'ENGINE': config('DB_ENGINE'),
    'NAME': config('DB_NAME'),
    'USER': config('DB_USER'),
    'PASSWORD': config('DB_PASSWORD'),
    'HOST': config('DB_HOST'),
  }
}


# Password validation
# https://docs.djangoproject.com/en/3.1/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
  {
    'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
  },
  {
    'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
  },
  {
    'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
  },
  {
    'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
  },
]


# Internationalization
# https://docs.djangoproject.com/en/3.1/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_L10N = True

USE_TZ = True

# Custom User model
AUTH_USER_MODEL = 'accounts.User'

# Customized authentication for email
AUTHENTICATION_BACKENDS = ['accounts.backends.EmailOrUsernameModelBackend']

STATIC_ROOT = os.path.join(BASE_DIR, 'static')
STATIC_URL = '/static/'
# STATICFILES_DIRS = [
#   os.path.join(BASE_DIR, 'agrimart/static')
# ]

MEDIA_ROOT = os.path.join(BASE_DIR, 'media')
MEDIA_URL = '/media/'

DEFAULT_RENDERER_CLASSES = (
  'rest_framework.renderers.JSONRenderer',
)

if DEBUG:
  DEFAULT_RENDERER_CLASSES = DEFAULT_RENDERER_CLASSES + (
    'rest_framework.renderers.BrowsableAPIRenderer',
  )

REST_FRAMEWORK = {
  # 'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.LimitOffsetPagination',
  # 'PAGE_SIZE': 100
  'DEFAULT_AUTHENTICATION_CLASSES': ('knox.auth.TokenAuthentication',)
}

REST_KNOX = {
  'SECURE_HASH_ALGORITHM': 'cryptography.hazmat.primitives.hashes.SHA512',
  'AUTH_TOKEN_CHARACTER_LENGTH': 64,
  'TOKEN_TTL': timedelta(minutes=60),
  'USER_SERIALIZER': 'accounts.User',
  'TOKEN_LIMIT_PER_USER': None,
  'AUTO_REFRESH': False,
  # 'EXPIRY_DATETIME_FORMAT': api_settings.DATETME_FORMAT,
}

EMAIL_BACKEND = config('EMAIL_BACKEND')
EMAIL_HOST = config('EMAIL_HOST')
EMAIL_HOST_USER = config('EMAIL_HOST_USER')
EMAIL_HOST_PASSWORD = config('EMAIL_HOST_PASSWORD')
EMAIL_PORT = config('EMAIL_PORT', cast=int)
EMAIL_USE_TLS = config('EMAIL_USE_TLS')
DEFAULT_FROM_EMAIL = config('DEFAULT_FROM_EMAIL')

PAYPAL_CLIENT_ID = config('PAYPAL_CLIENT_ID')
PAYPAL_CLIENT_SECRET = config('PAYPAL_CLIENT_SECRET')

FACEBOOK_AUTH_ID = config('FACEBOOK_AUTH_ID')
GOOGLE_API_KEY = config('GOOGLE_API_KEY')

# Version controller for frontend synchronization
APPLICATION_VERSION = 'v.1.0'