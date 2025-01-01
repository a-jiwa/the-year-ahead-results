import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useParams } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import Leaderboard from './pages/Leaderboard'; // Assuming you might create a dedicated Leaderboard component
import FullResults from './pages/FullResults'; // Import the new Full Results component

// const Leaderboard = () => <div>Leaderboard Page</div>;

// Component to handle redirection and userId management
const RedirectWithSession = ({ children }) => {
    const navigate = useNavigate();
    const { userId } = useParams();

    useEffect(() => {
        if (userId) {
            // Save userId to session storage
            sessionStorage.setItem('userId', userId);
        } else {
            // Check if userId exists in session storage
            const storedUserId = sessionStorage.getItem('userId');
            if (storedUserId) {
                navigate(`/user/${storedUserId}`);
            }
        }
    }, [userId, navigate]);

    return children;
};

// Wrapper to pass userId to the Header and Page components
const PageWithUserId = ({ children }) => {
    const { userId } = useParams();
    return (
        <>
            <Header userId={userId} />
            <div className="pt-20">{React.cloneElement(children, { userId })}</div>
        </>
    );
};

const App = () => {
    return (
        <Router basename="/the-year-ahead-results">
            <Routes>
                {/* Default routes without userId */}
                <Route
                    path="/"
                    element={
                        <RedirectWithSession>
                            <>
                                <Header />
                                <div className="pt-20">
                                    <Home />
                                </div>
                            </>
                        </RedirectWithSession>
                    }
                />
                <Route
                    path="/leaderboard"
                    element={
                        <RedirectWithSession>
                            <>
                                <Header />
                                <div className="pt-20">
                                    <Leaderboard />
                                </div>
                            </>
                        </RedirectWithSession>
                    }
                />
                <Route
                    path="/full-results"
                    element={
                        <RedirectWithSession>
                            <>
                                <Header />
                                <div className="pt-20">
                                    <FullResults />
                                </div>
                            </>
                        </RedirectWithSession>
                    }
                />

                {/* Routes with userId */}
                <Route
                    path="/user/:userId"
                    element={
                        <RedirectWithSession>
                            <PageWithUserId>
                                <Home />
                            </PageWithUserId>
                        </RedirectWithSession>
                    }
                />
                <Route
                    path="/user/:userId/leaderboard"
                    element={
                        <RedirectWithSession>
                            <PageWithUserId>
                                <Leaderboard />
                            </PageWithUserId>
                        </RedirectWithSession>
                    }
                />
                <Route
                    path="/user/:userId/full-results"
                    element={
                        <RedirectWithSession>
                            <PageWithUserId>
                                <FullResults />
                            </PageWithUserId>
                        </RedirectWithSession>
                    }
                />
            </Routes>
        </Router>
    );
};

export default App;
