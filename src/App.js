import React, { useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useParams } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import Leaderboard from './pages/Leaderboard';
import FullResults from './pages/FullResults';

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
const PageWithUserId = ({ children, isAccessedViaSpecialLink }) => {
    const { userId } = useParams();
    return (
        <>
            <Header userId={userId} />
            <div className="pt-20">
                {React.cloneElement(children, { userId, isAccessedViaSpecialLink })}
            </div>
        </>
    );
};

const App = () => {
    const scrollableContainerRef = useRef(null);

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
                                <div className="">
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
                                <div
                                    ref={scrollableContainerRef}
                                    className="pt-20 snap-proximity snap-y h-screen overflow-y-auto"
                                >
                                    <FullResults scrollableContainerRef={scrollableContainerRef} />
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
                            <PageWithUserId isAccessedViaSpecialLink={true}>
                                <Home />
                            </PageWithUserId>
                        </RedirectWithSession>
                    }
                />
                <Route
                    path="/user/:userId/leaderboard"
                    element={
                        <RedirectWithSession>
                            <PageWithUserId isAccessedViaSpecialLink={true}>
                                <Leaderboard />
                            </PageWithUserId>
                        </RedirectWithSession>
                    }
                />
                <Route
                    path="/user/:userId/full-results"
                    element={
                        <RedirectWithSession>
                            <PageWithUserId isAccessedViaSpecialLink={true}>
                                <FullResults scrollableContainerRef={scrollableContainerRef}

                                />
                            </PageWithUserId>
                        </RedirectWithSession>
                    }
                />
            </Routes>
        </Router>
    );
};

export default App;
