const request = require('supertest');

const server = require('./index.js');

describe('index.js', () => {
    // http calls made with supertest return promises, we can use async/await if desired
    describe('users route', () => {
        it('should return status 200', async () => {
            const response = await request(server).get('/api/users')
                .set('Accept', 'application/json')
                .set('Authorization', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Ik5ld0hlbHBlciIsInJvbGVpZCI6MiwiaWF0IjoxNTkwNzc2MDY3LCJleHAiOjE1OTA4NjI0Njd9.4FwQ8HW3daX7zfmbQYIKqrg7QJYlMk78gmek_2WHUyc')
                .expect(200);
            
            expect(response)
        })
        it('should return a JSON object from the index route', async () => {
            const response = await request(server).get('/api/users')
                .set('Accept', 'application/json')
                .set('Authorization', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Ik5ld0hlbHBlciIsInJvbGVpZCI6MiwiaWF0IjoxNTkwNzc2MDY3LCJleHAiOjE1OTA4NjI0Njd9.4FwQ8HW3daX7zfmbQYIKqrg7QJYlMk78gmek_2WHUyc')
                .expect(res => {
                    res.body = [
                        {
                            "user_id": 1,
                            "username": "admin",
                            "slack_id": null,
                            "role": "Helper",
                            "role_id": 2
                        },
                        {
                            "user_id": 2,
                            "username": "Dwight",
                            "slack_id": null,
                            "role": "Student",
                            "role_id": 1
                        },
                        {
                            "user_id": 3,
                            "username": "Frodo",
                            "slack_id": null,
                            "role": "Student",
                            "role_id": 1
                        },
                        {
                            "user_id": 4,
                            "username": "NewHelper",
                            "slack_id": null,
                            "role": "Helper",
                            "role_id": 2
                        }
                    ]
                });
        });
    });
}); 