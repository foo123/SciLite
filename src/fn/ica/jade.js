/*
"Blind beamforming for non Gaussian signals",
Jean-Francois Cardoso and Antoine Souloumiac, 1993

"On the performance of orthogonal source separation algorithms",
Jean-Francois Cardoso, 1994

"High-order contrasts for independent component analysis",
Jean-Francois Cardoso, 1999
*/

// jadeR.m
// adapted from Cardoso's 2013 version of jadeR.m
// https://www2.iap.fr/users/cardoso/compsep_classic.html
fn.jadeR = $fn("jadeR", `function B =  jadeR(X, m)
%   B = jadeR(X, m) is an m*n matrix such that Y=B*X are separated sources
%    extracted from the n*T data matrix X.
%   If m is omitted,  B=jadeR(X)  is a square n*n matrix (as many sources as sensors)
%
% Blind separation of real signals with JADE.  Version 1.9.   August 2013
%
% Usage:
%   * If X is an nxT data matrix (n sensors, T samples) then
%     B=jadeR(X) is a nxn separating matrix such that S=B*X is an nxT
%     matrix of estimated source signals.
%   * If B=jadeR(X,m), then B has size mxn so that only m sources are
%     extracted.  This is done by restricting the operation of jadeR
%     to the m first principal components.
%   * Also, the rows of B are ordered such that the columns of pinv(B)
%     are in order of decreasing norm; this has the effect that the
%     'most energetically significant' components appear first in the
%     rows of S=B*X.
verbose	= 0 ;	% Set to 0 for quiet operation

% Finding the number of sources
[n,T]	= size(X);
if nargin==1, m=n ; end; 	% Number of sources defaults to # of sensors
%if m>n ,    fprintf('jade -> Do not ask more sources than sensors here!!!'), return,end
%if verbose, fprintf('jade -> Looking for %d sources',m); end ;

% Mean removal
%=============
%if verbose, fprintf('jade -> Removing the mean value'); end
X	= X - mean(X')' * ones(1,T);


%%% whitening & projection onto signal subspace
%   ===========================================
%if verbose, fprintf('jade -> Whitening the data'); end

[U,D]     = eig((X*X')/T) ; %% An eigen basis for the sample covariance matrix
[Ds,k]    = sort(diag(D)) ; %% Sort by increasing variance
PCs       = n:-1:n-m+1    ; %% The m most significant princip. comp. by decreasing variance

%% --- PCA  ----------------------------------------------------------
B         = U(:,k(PCs))'    ; % At this stage, B does the PCA on m components

%% --- Scaling  ------------------------------------------------------
scales    = sqrt(Ds(PCs)) ; % The scales of the principal components .
B         = diag(1./scales)*B  ; % Now, B does PCA followed by a rescaling = sphering


%% --- Sphering ------------------------------------------------------
X         = B*X;  %% We have done the easy part: B is a whitening matrix and X is white.

%clear U D Ds k PCs scales ;
U = 0;
D = 0;
Ds = 0;
k = 0;
PCs = 0;
scales = 0;

%%% NOTE: At this stage, X is a PCA analysis in m components of the real data, except that
%%% all its entries now have unit variance.  Any further rotation of X will preserve the
%%% property that X is a vector of uncorrelated components.  It remains to find the
%%% rotation matrix such that the entries of X are not only uncorrelated but also 'as
%%% independent as possible'.  This independence is measured by correlations of order
%%% higher than 2.  We have defined such a measure of independence which
%%%   1) is a reasonable approximation of the mutual information
%%%   2) can be optimized by a 'fast algorithm'
%%% This measure of independence also corresponds to the 'diagonality' of a set of
%%% cumulant matrices.  The code below finds the 'missing rotation ' as the matrix which
%%% best diagonalizes a particular set of cumulant matrices.


%%% Estimation of the cumulant matrices.
%   ====================================
%if verbose, fprintf('jade -> Estimating cumulant matrices'); end

%% Reshaping of the data, hoping to speed up things a little bit...
X = X';

dimsymm 	= (m*(m+1))/2;	% Dim. of the space of real symm matrices
nbcm 		= dimsymm  ; 	% number of cumulant matrices
CM 		= zeros(m,m*nbcm);  % Storage for cumulant matrices
R 		= eye(m);  	%%
Qij 		= zeros(m);	% Temp for a cum. matrix
Xim		= zeros(m,1);	% Temp
Xijm		= zeros(m,1);	% Temp
Uns		= ones(1,m);    % for convenience


%% I am using a symmetry trick to save storage.  I should write a short note one of these
%% days explaining what is going on here.
%%
Range     = 1:m ; % will index the columns of CM where to store the cumulant matrices.

for im = 1:m
  Xim = X(:,im) ;
  Xijm= Xim.*Xim ;
  %% Note to myself: the -R on next line can be removed: it does not affect
  %% the joint diagonalization criterion
  Qij           = ((Xijm(:,Uns).*X)' * X)/T - R - 2 * R(:,im)*R(:,im)' ;
  CM(:,Range)	= Qij ;
  Range         = Range  + m ;
  for jm = 1:im-1
    Xijm        = Xim.*X(:,jm) ;
    Qij         = sqrt(2) *(((Xijm(:,Uns).*X)' * X)/T - R(:,im)*R(:,jm)' - R(:,jm)*R(:,im)') ;
    CM(:,Range)	= Qij ;
    Range       = Range  + m ;
  end ;
end;
%%%% Now we have nbcm = m(m+1)/2 cumulants matrices stored in a big m x m*nbcm array.

%%% Joint diagonalization of the cumulant matrices
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%


%% Init
if 0, 	%% Init by diagonalizing a *single* cumulant matrix.  It seems to save
	%% some computation time 'sometimes'.  Not clear if initialization is really worth
	%% it since Jacobi rotations are very efficient.  On the other hand, it does not
	%% cost much...

	%if verbose, fprintf('jade -> Initialization of the diagonalization'); end
	[V,D]	= eig(CM(:,1:m)); % Selectng a particular cumulant matrix.
	for u=1:m:m*nbcm,         % Accordingly updating the cumulant set given the init
		CM(:,u:u+m-1) = CM(:,u:u+m-1)*V ;
	end;
	CM	= V'*CM;

else,	%% The dont-try-to-be-smart init
	V	= eye(m) ; % la rotation initiale
end;

%% Computing the initial value of the contrast
Diag    = zeros(m,1) ;
On      = 0 ;
Range   = 1:m ;
for im = 1:nbcm,
  Diag  = diag(CM(:,Range)) ;
  On    = On + sum(Diag.*Diag) ;
  Range = Range + m ;
end;
Off = sum(sum(CM.*CM)) - On ;


seuil	= 1.0e-6 / sqrt(T) ; % A statistically scaled threshold on 'small' angles
encore	= 1;
sweep	= 0; % sweep number
updates = 0; % Total number of rotations
upds    = 0; % Number of rotations in a given seep
g	= zeros(2,nbcm);
gg	= zeros(2,2);
G	= zeros(2,2);
c	= 0 ;
s 	= 0 ;
ton	= 0 ;
toff	= 0 ;
theta	= 0 ;
Gain    = 0 ;

%% Joint diagonalization proper
%if verbose, fprintf('jade -> Contrast optimization by joint diagonalization'); end

while encore, encore=0;

  %if verbose, fprintf('jade -> Sweep #%3d',sweep); end
  %sweep = sweep+1;
  %upds  = 0 ;
  Vkeep = V ;

  for p=1:m-1,
    for q=p+1:m,

      Ip = p:m:m*nbcm ;
      Iq = q:m:m*nbcm ;

      %%% computation of Givens angle
      g	    = [ CM(p,Ip)-CM(q,Iq) ; CM(p,Iq)+CM(q,Ip) ];
      gg    = g*g';
      ton   = gg(1,1)-gg(2,2);
      toff  = gg(1,2)+gg(2,1);
      theta = 0.5*atan2( toff , ton+sqrt(ton*ton+toff*toff) );
      Gain  = (sqrt(ton*ton+toff*toff) - ton) / 4 ;

      %%% Givens update
      if abs(theta) > seuil,
%%      if Gain > 1.0e-3*On/m/m ,
	encore  = 1 ;
	%upds    = upds    + 1;
	c	= cos(theta);
	s	= sin(theta);
	G	= [ c -s ; s c ] ;

	pair 		= [p;q] ;
	V(:,pair) 	= V(:,pair)*G ;
	CM(pair,:)	= G' * CM(pair,:) ;
	CM(:,[Ip Iq]) 	= [ c*CM(:,Ip)+s*CM(:,Iq) -s*CM(:,Ip)+c*CM(:,Iq) ] ;


	On   = On  + Gain;
	Off  = Off - Gain;

	%% fprintf('jade -> %3d %3d %12.8f',p,q,Off/On);
      end;%%of the if
    end;%%of the loop on q
  end;%%of the loop on p
  %if verbose, fprintf(' completed in %d rotations',upds); end
  %updates = updates + upds ;

end;%%of the while loop
%if verbose, fprintf('jade -> Total of %d Givens rotations',updates); end


%%% A separating matrix
%   ===================
B	= V'*B ;


%%% Permut the rows of the separating matrix B to get the most energetic components first.
%%% Here the **signals** are normalized to unit variance.  Therefore, the sort is
%%% according to the norm of the columns of A = pinv(B)

%if verbose, fprintf('jade -> Sorting the components',updates); end
A           = pinv(B) ;
[Ds,keys]   = sort(sum(A.*A)) ;
B           = B(keys,:)       ;
B           = B(m:-1:1,:)     ; % Is this smart ?


% Signs are fixed by forcing the first column of B to have non-negative entries.

%if verbose, fprintf('jade -> Fixing the signs',updates); end
b	= B(:,1) ;
signs	= sign(sign(b)+0.1) ; % just a trick to deal with sign=0
B	= diag(signs)*B ;
end`);

// jade.m
// adapted from Cardoso's 2013 version of jade.m
// https://www2.iap.fr/users/cardoso/compsep_classic.html
fn.jade = $fn("jade", `function [A,S] =  jade(X, m)
% Source separation of complex signals with JADE.
% Jade performs 'Source Separation' in the following sense:
%   X is an n x T data matrix assumed modelled as X = A S + N where
%
% o A is an unknown n x m matrix with full rank.
% o S is a m x T data matrix (source signals) with the properties
%    	a) for each t, the components of S(:,t) are statistically
%    	   independent
% 	b) for each p, the S(p,:) is the realization of a zero-mean
% 	   'source signal'.
% 	c) At most one of these processes has a vanishing 4th-order
% 	   cumulant.
% o  N is a n x T matrix. It is a realization of a spatially white
%    Gaussian noise, i.e. Cov(X) = sigma*eye(n) with unknown variance
%    sigma.  This is probably better than no modeling at all...
%
% Jade performs source separation via a
% Joint Approximate Diagonalization of Eigen-matrices.
%
% THIS VERSION ASSUMES ZERO-MEAN SIGNALS
%
% Input :
%   * X: Each column of X is a sample from the n sensors
%   * m: m is an optional argument for the number of sources.
%     If ommited, JADE assumes as many sources as sensors.
%
% Output :
%    * A is an n x m estimate of the mixing matrix
%    * S is an m x T naive (ie pinv(A)*X)  estimate of the source signals
%
%
% Version 1.6.  Copyright: JF Cardoso.
[n,T]	= size(X);

%%  source detection not implemented yet !
if nargin==1, m=n ; end;


%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
% A few parameters that could be adjusted
nem	= m;		% number of eigen-matrices to be diagonalized
seuil	= 1/sqrt(T)/100;% a statistical threshold for stopping joint diag


%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%%% whitening
%
if m<n, %assumes white noise
 	[U,D] 	= eig((X*X')/T);
	[puiss,k]=sort(diag(D));
 	ibl 	= sqrt(puiss(n-m+1:n)-mean(puiss(1:n-m)));
 	bl 	= ones(m,1) ./ ibl ;
 	W	= diag(bl)*U(1:n,k(n-m+1:n))';
 	IW 	= U(1:n,k(n-m+1:n))*diag(ibl);
else    %assumes no noise
 	IW 	= sqrtm((X*X')/T);
 	W	= inv(IW);
end;
Y	= W*X;

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%%% Cumulant estimation


R	= (Y*Y' )/T ;
C	= (Y*Y.')/T ;

Yl	= zeros(1,T);
Ykl	= zeros(1,T);
Yjkl	= zeros(1,T);

Q	= zeros(m*m*m*m,1) ;
index	= 1;

for lx = 1:m ; Yl 	= Y(lx,:);
for kx = 1:m ; Ykl 	= Yl.*conj(Y(kx,:));
for jx = 1:m ; Yjkl	= Ykl.*conj(Y(jx,:));
for ix = 1:m ;
	Q(index) = (Yjkl * Y(ix,:).')/T -  R(ix,jx)*R(lx,kx) -  R(ix,kx)*R(lx,jx) -  C(ix,lx)*conj(C(jx,kx))  ;
	index	= index + 1 ;
end ;
end ;
end ;
end ;

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%%%computation and reshaping of the significant eigen matrices

[U,D]	= eig(reshape(Q,m*m,m*m));
[la,K]	= sort(abs(diag(D)));

%% reshaping the most (there are 'nem' of them) significant eigenmatrice
M	= zeros(m,nem*m);	% array to hold the significant eigen-matrices
Z	= zeros(m)	; % buffer
h	= m*m;
for u=1:m:nem*m,
	Z(:) 		= U(:,K(h));
	M(:,u:u+m-1)	= la(h)*Z;
	h		= h-1;
end;


%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%%% joint approximate diagonalization of the eigen-matrices


%% Better declare the variables used in the loop :
B 	= [ 1 0 0 ; 0 1 1 ; 0 -i i ] ;
Bt	= B' ;
Ip	= zeros(1,nem) ;
Iq	= zeros(1,nem) ;
g	= zeros(3,nem) ;
G	= zeros(2,2) ;
vcp	= zeros(3,3);
D	= zeros(3,3);
la	= zeros(3,1);
K	= zeros(3,3);
angles	= zeros(3,1);
pair	= zeros(1,2);
c	= 0 ;
s	= 0 ;


%init;
encore	= 1;
V	= eye(m);

% Main loop
while encore, encore=0;
 for p=1:m-1,
  for q=p+1:m,

 	Ip = p:m:nem*m ;
	Iq = q:m:nem*m ;

	% Computing the Givens angles
 	g	= [ M(p,Ip)-M(q,Iq)  ; M(p,Iq) ; M(q,Ip) ] ;
 	[vcp,D] = eig(real(B*(g*g')*Bt));
	[la, K]	= sort(diag(D));
 	angles	= vcp(:,K(3));
	if angles(1)<0 , angles= -angles ; end ;
 	c	= sqrt(0.5+angles(1)/2);
 	s	= 0.5*(angles(2)-j*angles(3))/c;

 	if abs(s)>seuil, %%% updates matrices M and V by a Givens rotation
	 	encore 		= 1 ;
		pair 		= [p;q] ;
 		G 		= [ c -conj(s) ; s c ] ;
		V(:,pair) 	= V(:,pair)*G ;
	 	M(pair,:)	= G' * M(pair,:) ;
		M(:,[Ip Iq]) 	= [ c*M(:,Ip)+s*M(:,Iq) -conj(s)*M(:,Ip)+c*M(:,Iq) ] ;
 	end;%% if
  end;%% q loop
 end;%% p loop
end;%% while

%%%estimation of the mixing matrix and signal separation
A	= IW*V;
if 1<nargout, S	= V'*Y ; end;
end`);
