from passlib.context import CryptContext
import random
import hashlib
import socket
import time
import re

def generate_id() -> int:
    timestamp = int(time.time() * 1000)
    random_num = random.randint(1000, 9999)
    return timestamp + random_num
def get_password_hash(password) -> str:
    pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
    return pwd_context.hash(password)
def verify_password(plain_password, hashed_password) -> bool:
    pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
    return pwd_context.verify(plain_password, hashed_password)
def get_ip_address() -> str:
    return socket.gethostbyname(socket.gethostname())
def hash_ip(ip_address: str) -> str:
    return hashlib.sha256(ip_address.encode('utf-8')).hexdigest()
def validate_email(email) -> bool:
    regex = r'\b[A-Za-z0-9]+(?:[.-_][A-Za-z0-9]+)*@[A-Za-z0-9-]+.[A-Za-z]{2,7}\b'
    return re.fullmatch(regex, email)