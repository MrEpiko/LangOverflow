from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from controllers import threadController, replyController, userController
import os
app = FastAPI(title="LangOverflow", version="1.0", root_path="/api", debug=True)
origins = [
    "http://localhost:5173",
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get('/ping', tags=["ping"])
def ping():
    return {"message": "success", "status": 200}

app.include_router(userController.user_router, prefix="/users", tags=["user"])
app.include_router(threadController.thread_router, prefix="/threads", tags=["threads"])
app.include_router(replyController.reply_router, prefix="/replies", tags=["replies"])

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host=os.getenv("HOST", "0.0.0.0"), port=int(os.getenv("PORT", 8080)))